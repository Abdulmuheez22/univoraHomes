import {
  signUpValidation,
  signInValidator,
  otpValidator,
  forgotPasswordValidator,
  resetOtpValidator,
  resetPasswordValidator,
} from "../utils/user.validate.js";
import { hashPassword, confrimHashPassword } from "../utils/hasher.js";
import { usersTable } from "../src/db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../src/test-db.js";
import { tokenGenerator, verifyToken } from "../utils/jwt.js";
import {
  collectFieldErrors,
  summarizeFieldErrors,
} from "../utils/validationErrors.js";
import env from "../config/env.js";
import crypto from "node:crypto";
import {
  sendOtpEmail,
  sendPasswordResetEmail,
} from "../services/otpMail.services.js";
import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const RESET_OTP_MAX_ATTEMPTS = 5;
const RESET_TOKEN_PURPOSE = "password-reset";
const RESET_REQUEST_MESSAGE = "If that email exists, we sent a code.";

export const signUp = async (req: any, res: any) => {
  try {
    const validatedUser = signUpValidation.safeParse(req.body);
    if (!validatedUser.success) {
      const fieldErrors = collectFieldErrors(validatedUser.error);
      return res.status(400).json({
        message: summarizeFieldErrors(fieldErrors),
        errors: fieldErrors,
      });
    }

    const existingEmail = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, validatedUser.data.email));
    if (existingEmail.length > 0) {
      return res.status(200).json({
        message: "Email already exists",
        errors: { email: "An account already exists for this email." },
      });
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
    const validateEmailData = otpValidator
      .pick({ email: true })
      .safeParse(req.body);
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
        message: "User not found ",
      });
    }

    if (user.otpExpiry) {
      const issuedAt = new Date(user.otpExpiry).getTime() - OTP_LIFETIME_MS;
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
      message: "A new code has been sent.",
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
    const isProduction = process.env.NODE_ENV === "production";

    // Verifying the code proves the email belongs to them, so the session
    // starts here — otherwise the dashboard answers 401 straight after sign up.
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
      })
      .json({ message: true, token: token, role: user.role });
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

    if (!userDb.password) {
      return res
        .status(400)
        .json({ message: "This account has no password set." });
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
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
      })
      .json({ message: "SignIn Successful", role: userDb.role });
  } catch (error) {
    console.log("this error is from signIn catch: ", error);
   return res.status(500).json({ message: "error", error });
  }
};

export const userProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unautorized" });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    const frontendUser = {
      userName: user?.fullName,
      userEmail: user?.email,
      userPhone: user?.phoneNumber,
      userState: user?.state,
      userCity: user?.city,
      userRole: user?.role,
    };
    return res.status(200).json({ user: frontendUser });
  } catch (error) {
    console.log("this error is from the userProfile catch: ", error);
  }
};

export const signOut = (_req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
    })
    .status(200)
    .json({ message: "Signed out successfully" });
};

/* ---------------------------------------------------------------------------
   Password reset: request a code -> verify the code -> set the new password.
   The request step always answers with the same message, so it can't be used to
   find out which emails have accounts.
--------------------------------------------------------------------------- */

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = forgotPasswordValidator.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validatedData.data.email));

    // Accounts without a password have nothing to reset, so nothing is sent
    // for them either.
    if (user?.password) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      const hashedOtp = await hashPassword(otp);

      await db
        .update(usersTable)
        .set({
          resetOtp: hashedOtp,
          resetOtpExpiry: new Date(Date.now() + OTP_LIFETIME_MS),
          resetOtpAttempts: 0,
        })
        .where(eq(usersTable.id, user.id));

      try {
        await sendPasswordResetEmail(user.email, otp);
      } catch (error) {
        // A mail failure must not reveal that the account exists.
        console.log("forgotPassword mail error: ", error);
      }
    }

    return res.status(200).json({ message: RESET_REQUEST_MESSAGE });
  } catch (error) {
    console.log("forgotPassword error: ", error);
    return res
      .status(500)
      .json({ message: "Unable to process the request. Please try again." });
  }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    const validatedData = resetOtpValidator.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ message: "Enter the 6 digit code." });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, validatedData.data.email));

    if (!user?.resetOtp || !user.resetOtpExpiry) {
      return res
        .status(400)
        .json({ message: "That code is invalid or has expired." });
    }

    if (Date.now() > new Date(user.resetOtpExpiry).getTime()) {
      await db
        .update(usersTable)
        .set({ resetOtp: null, resetOtpExpiry: null, resetOtpAttempts: 0 })
        .where(eq(usersTable.id, user.id));

      return res
        .status(400)
        .json({ message: "That code has expired. Request a new one." });
    }

    if (user.resetOtpAttempts >= RESET_OTP_MAX_ATTEMPTS) {
      return res
        .status(429)
        .json({ message: "Too many attempts. Request a new code." });
    }

    const codeMatches = await confrimHashPassword(
      validatedData.data.otp,
      user.resetOtp,
    );

    if (!codeMatches) {
      const attempts = user.resetOtpAttempts + 1;

      await db
        .update(usersTable)
        .set({ resetOtpAttempts: attempts })
        .where(eq(usersTable.id, user.id));

      const attemptsLeft = RESET_OTP_MAX_ATTEMPTS - attempts;

      return res.status(400).json({
        message:
          attemptsLeft > 0
            ? `That code doesn't match. ${attemptsLeft} ${
                attemptsLeft === 1 ? "attempt" : "attempts"
              } left.`
            : "Too many attempts. Request a new code.",
      });
    }

    // The code is single use: clear it before handing out the reset token.
    await db
      .update(usersTable)
      .set({ resetOtp: null, resetOtpExpiry: null, resetOtpAttempts: 0 })
      .where(eq(usersTable.id, user.id));

    const resetToken = tokenGenerator(
      { id: user.id, purpose: RESET_TOKEN_PURPOSE },
      env.jwtSecret,
      // Short-lived on purpose: enough to finish the reset, useless after.
      "10m",
    );

    return res.status(200).json({ message: "Code verified.", resetToken });
  } catch (error) {
    console.log("verifyResetOtp error: ", error);
    return res
      .status(500)
      .json({ message: "Unable to verify the code. Please try again." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordValidator.safeParse(req.body);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    let decoded: string | JwtPayload;
    try {
      decoded = verifyToken(validatedData.data.resetToken, env.jwtSecret);
    } catch {
      return res
        .status(401)
        .json({ message: "This reset link has expired. Request a new code." });
    }

    if (
      typeof decoded === "string" ||
      decoded.purpose !== RESET_TOKEN_PURPOSE ||
      !decoded.id
    ) {
      return res.status(401).json({ message: "This reset link is not valid." });
    }

    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await hashPassword(validatedData.data.password);

    // Reaching this point proves the caller controls the email address, so an
    // unverified account is marked verified too — otherwise the user would
    // reset the password and still be refused at sign-in.
    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
        isVerified: true,
        resetOtp: null,
        resetOtpExpiry: null,
        resetOtpAttempts: 0,
      })
      .where(eq(usersTable.id, user.id));

    return res
      .status(200)
      .json({ message: "Password updated. You can now sign in." });
  } catch (error) {
    console.log("resetPassword error: ", error);
    return res
      .status(500)
      .json({ message: "Unable to reset the password. Please try again." });
  }
};
