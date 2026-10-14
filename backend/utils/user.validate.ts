import * as z from "zod";

const fullName = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be at most 100 characters");

const role = z.enum(["landlord", "agent", "tenant"])

const email = z.string().trim().email("Enter a valid email address").max(254);

// Sign-up only. Kept separate from `email` so the rule can't lock out accounts
// that already exist with another TLD (sign-in, OTP and reset reuse `email`).
const signUpEmail = email.refine(
  (value) => value.toLowerCase().endsWith(".com"),
  "Enter an email address ending with .com",
);

const phoneNumber = z
  .coerce
  .string()
  .trim()
  // The form renders a fixed +234 prefix, so a typed trunk 0 (070/080/090) is
  // dropped instead of being stored.
  .transform((value) => value.replace(/^0(?=[789])/, ""))
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  }, "Phone number must be 10 or 11 digits");

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
    email: signUpEmail,
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

/* Password reset: request a code, confirm the code, then set the new password. */
export const forgotPasswordValidator = z.object({
  email,
})

export const resetOtpValidator = z.object({
  email,
  otp,
})

export const resetPasswordValidator = z.object({
  resetToken: z.string().trim().min(10, "Reset token is required"),
  // The reset token proves ownership of the email, so the same password rules apply.
  password,
})

export const profileUpdateValidator = z.object({
  fullName: fullName.max(100),
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters")
    .max(20, "Phone number must be at most 20 characters"),
  state: z.string().trim().max(100, "State must be at most 100 characters"),
  city: z.string().trim().max(100, "City must be at most 100 characters"),
});

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
