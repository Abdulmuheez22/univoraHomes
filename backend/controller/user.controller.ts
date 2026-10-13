import {
  signUpValidation,
  signInValidator,
  otpValidator,
} from "../utils/user.validate.js";
import { hashPassword, confrimHashPassword } from "../utils/hasher.js";
import { usersTable } from "../src/db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../src/test-db.js";
import { tokenGenerator } from "../utils/jwt.js";
import env from "../config/env.js";
import crypto from "node:crypto";
import { sendOtpEmail } from "../services/otpMail.services.js";
import type { Request, Response } from "express";

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

export const signUp = async (req: any, res: any) => {
  try {
    const validatedUser = signUpValidation.safeParse(req.body);
    if (!validatedUser.success) {
      console.log(validatedUser.error);
      return res
        .status(400)
        .json("error validating user: ", validatedUser.error);
    }

    const existingEmail = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, validatedUser.data.email));
    if (existingEmail.length > 0) {
      return res.json({ message: "Email already exists" });
    }

    const hashedPassword: string = await hashPassword(
      validatedUser.data.password,
    );

    const otp: string = crypto.randomInt(100000, 999999).toString();
    const hashedOtp: string = await hashPassword(otp);

    const user = {
      fullName: validatedUser.data.fullName,
      role: validatedUser.data.role,
      email: validatedUser.data.email,
      otp: hashedOtp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      phoneNumber: validatedUser.data.phoneNumber,
      state: validatedUser.data.state,
      city: validatedUser.data.city,
      password: hashedPassword,
    };

    const newUser = await db.insert(usersTable).values(user).returning();

    await sendOtpEmail(user.email, otp);

    return res.status(201).json({
      message:
        "Account created Successfully, Check your email for verification otp",
    });
  } catch (err) {
    console.log("this error is from the signup catch: ", err);
    return res.status(500).send("error creating user");
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const validateEmailData = otpValidator.pick({ email: true }).safeParse(req.body);
    if (!validateEmailData.success) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const [user] = await db
      .select({
        email: usersTable.email,
        isVerified: usersTable.isVerified,
        otp: usersTable.otp,
        otpExpiry: usersTable.otpExpiry,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validateEmailData.data.email));

    if (!user || user.isVerified) {
      return res.status(200).json({
        message:
          "If this email belongs to an account that needs verification, a new code has been sent.",
      });
    }

    if (user.otpExpiry) {
      const issuedAt =
        new Date(user.otpExpiry).getTime() - OTP_LIFETIME_MS;
      const retryAfterMs = OTP_RESEND_COOLDOWN_MS - (Date.now() - issuedAt);
      if (retryAfterMs > 0) {
        return res.status(429).json({
          message: "Please wait before requesting another verification code.",
          retryAfter: Math.ceil(retryAfterMs / 1000),
        });
      }
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await hashPassword(otp);
    const otpExpiry = new Date(Date.now() + OTP_LIFETIME_MS);

    await sendOtpEmail(user.email, otp);

    await db
      .update(usersTable)
      .set({ otp: hashedOtp, otpExpiry })
      .where(eq(usersTable.email, user.email));

    return res.status(200).json({
      message:
        "If this email belongs to an account that needs verification, a new code has been sent.",
    });
  } catch (error) {
    console.error("resendOtp error:", error);
    return res.status(500).json({
      message: "Unable to send a new verification code. Please try again.",
    });
  }
};

export const verifyOtp = async (req: any, res: any) => {
  try {
    const validateOtpData = otpValidator.safeParse(req.body);
    if (!validateOtpData.success) {
      console.log(validateOtpData.error);
      return res.status(400).json({ message: "Error validating otp" });
    }
    console.log(validateOtpData.data);

    const validatedEmail = validateOtpData.data.email;
    const validatedOtp = validateOtpData.data.otp;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, validatedEmail));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found for this user" });
    }

    if (!user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found for this user" });
    }

    const now = new Date().getTime();
    const expiryTime = new Date(user.otpExpiry).getTime();

    if (now > expiryTime) {
      return res
        .status(400)
        .json({ message: "OTP already expired, try again" });
    }
    const checkOtp = await confrimHashPassword(validatedOtp, user.otp);

    if (!checkOtp) {
      return res.status(400).json({ message: false });
    }

    await db
      .update(usersTable)
      .set({ isVerified: true, otp: null, otpExpiry: null })
      .where(eq(usersTable.email, user.email));

    const jwtUser: object = {
      id: user.id,
      role: user.role,
    };

    const token = tokenGenerator(jwtUser, env.jwtSecret);

    return res.status(200).json({ message: true, token: token });
  } catch (error) {
    console.log("this error is from the verifyOtp catch: ", error);
    return res.status(500).json({ "Verification OTP Error": error });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(404).json({ message: "Invaild request from user" });
    }
    const validatedUser = signInValidator.safeParse(req.body);
    if (!validatedUser.success) {
      console.log(
        "this error is from the zod validation: ",
        validatedUser.error,
      );
      return res.status(400).json({ message: "Error validating user" });
    }
    const userEmail = validatedUser.data.email;
    const userPassword = validatedUser.data.password;

    const [userDb] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (!userDb) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userDb.isVerified === false) {
      return res.status(401).json({ message: "Unverifield User" });
    }

    // Google-only accounts never set a password, so there is nothing to compare.
    if (!userDb.password) {
      return res
        .status(400)
        .json({ message: "This account uses Google sign in." });
    }

    const verifyPassword = await confrimHashPassword(
      userPassword,
      userDb.password,
    );

    if (!verifyPassword) {
      return res.status(401).json({ message: "IncorrectValidation" });
    }

    const jwtUser: object = {
      id: userDb.id,
      role: userDb.role,
    };

    const token = tokenGenerator(jwtUser, env.jwtSecret);
    const isProduction = process.env.NODE_ENV === "production";

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
      })
      .json({ message: "SignIn Successful", role: userDb.role});
  } catch (error) {
    console.log("this error is from signIn catch: ", error);
    res.status(500).json({ message: "error", error });
  }
};




export const userProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    if(!userId){return res.status(401).json({message: "Unautorized"})}

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId))

    const frontendUser = {
      userName: user?.fullName,
      userEmail: user?.email,
      userPhone: user?.phoneNumber,
      userState: user?.state,
      userCity: user?.city,
      userRole: user?.role,


    }
    return res.status(200).json({user: frontendUser})
    
  } catch (error) {
    console.log("this error is from the userProfile catch: ", error)
  }
}

export const signOut = (_req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
    })
    .status(200)
    .json({ message: "Signed out successfully" });
};
