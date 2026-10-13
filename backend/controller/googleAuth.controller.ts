import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { eq } from "drizzle-orm";
import { db } from "../src/test-db.js";
import { usersTable } from "../src/db/schema.js";
import { tokenGenerator } from "../utils/jwt.js";
import env from "../config/env.js";
import type { Request, Response } from "express";

// One client is enough: it only needs our client id as the expected audience.
const googleClient = new OAuth2Client(env.googleClientId);

const isProduction = process.env.NODE_ENV === "production";

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { credential, role } = req.body ?? {};

    if (!credential) {
      return res
        .status(400)
        .json({ message: "Missing Google credential from the request." });
    }

    // 1. Verify the ID token Google handed to the frontend. A bad signature,
    // wrong audience or expired token all throw here.
    let payload: TokenPayload | undefined;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.googleClientId,
      });
      payload = ticket.getPayload();
    } catch (error) {
      console.log("google id token verification failed: ", error);
      return res.status(400).json({ message: "Invalid Google token." });
    }

    if (!payload?.email || !payload.sub) {
      return res
        .status(400)
        .json({ message: "That Google account has no email or id." });
    }

    // 2. Google tells us whether it has verified the address. We only trust
    // verified emails, since the email is what links Google to an account.
    if (!payload.email_verified) {
      return res
        .status(400)
        .json({ message: "That Google email address is not verified." });
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const avatar = payload.picture?.slice(0, 500) ?? null;
    const fullName =
      payload.name?.slice(0, 255) || email.split("@")[0] || email;

    // 3. Find by email so one person can use both password and Google.
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    let user = existingUser;
    let isNewUser = false;

    if (!user) {
      isNewUser = true;

      // Google gives us no role or phone number. The sign up page sends the
      // role the visitor picked; anything else falls back to "tenant".
      const requestedRole =
        role === "landlord" || role === "agent" ? role : "tenant";

      [user] = await db
        .insert(usersTable)
        .values({
          fullName,
          email,
          role: requestedRole,
          googleId,
          avatar,
          // Google has already proven the visitor owns this email, so there
          // is no OTP step for them.
          isVerified: true,
        })
        .returning();
    } else if (!user.googleId) {
      // An existing password account signing in with Google for the first
      // time: remember the googleId so both routes work from now on.
      [user] = await db
        .update(usersTable)
        .set({
          googleId,
          avatar: user.avatar ?? avatar,
          isVerified: true,
        })
        .where(eq(usersTable.id, user.id))
        .returning();
    }

    if (!user) {
      return res
        .status(500)
        .json({ message: "We couldn't load your account. Please try again." });
    }

    // 4. Our own session token, in an httpOnly cookie so JS cannot read it.
    const token = tokenGenerator(
      { id: user.id, role: user.role },
      env.jwtSecret,
    );

    // 5. Only non-sensitive fields go back to the client.
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
      })
      .json({
        message: isNewUser
          ? "Account created with Google"
          : "Signed in with Google",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    console.log("this error is from the googleSignIn catch: ", error);
    return res.status(500).json({
      message: "We couldn't sign you in with Google. Please try again.",
    });
  }
};
