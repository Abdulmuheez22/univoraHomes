import { validate } from "./../node_modules/zod/src/v4/core/parse";
import {
  signUpValidation,
  signInValidator,
  otpValidator,
} from "../utils/user.validate";
import { hashPassword, confrimHashPassword } from "../utils/hasher";
import { usersTable } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../src/test-db";
import { tokenGenerator } from "../utils/jwt";
import env from "../config/env";
import crypto from "node:crypto";
import { sendOtpEmail } from "../services/otpMail.services";
import { check, date, email, string } from "zod";
import { id } from "zod/locales";
import type { Request, Response } from "express";

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