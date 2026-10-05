import { signIn } from './../controller/user.controller';
import * as z from "zod";

const fullName = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be at most 100 characters");

const role = z.enum(["landlord", "agent", "tenant"])

const email = z.string().trim().email("Enter a valid email address").max(254);

const phoneNumber = z.coerce.string().trim();

const state = z
  .string()
  .trim()
  .min(2, "State must be at least 2 characters")
  .max(100, "State must be at most 100 characters");

const city = z
  .string()
  .trim()
  .min(2, "City must be at least 2 characters")
  .max(100, "City must be at most 100 characters");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");


const otp = z.string().length(6, "OTP must be exactly 6 characters");  

// const 


export const signUpValidation = z.object({
    fullName,
    role,
    email,
    phoneNumber,
    state, 
    city,
    password

})


export const otpValidator = z.object({
  email,
  otp
})

export const signInValidator = z.object({
  email,
  password
})

export const savedPropertyValidator = z.object({

})

    // .enum(["landlord", "tenant", "agent
// export const signUpValidation = () => {
//     fullName: user.name,
//     role: user.role,
//     email: user.email,
//     phoneNumber: user.phoneNumber,
//     state: user.state,
//     city: user.city,
//     password: user.password
// }
