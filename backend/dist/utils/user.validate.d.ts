import * as z from "zod";
export declare const signUpValidation: z.ZodObject<{
    fullName: z.ZodString;
    role: z.ZodEnum<{
        agent: "agent";
        landlord: "landlord";
        tenant: "tenant";
    }>;
    email: z.ZodString;
    phoneNumber: z.ZodCoercedString<unknown>;
    state: z.ZodString;
    city: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const otpValidator: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export declare const signInValidator: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const savedPropertyValidator: z.ZodObject<{}, z.core.$strip>;
//# sourceMappingURL=user.validate.d.ts.map