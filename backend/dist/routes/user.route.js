import { Router } from "express";
import { verifyOtp, signUp, signIn, signOut, resendOtp, userProfile, forgotPassword, verifyResetOtp, resetPassword, } from "../controller/user.controller.js";
import { authmiddleware } from "../middleware/auth.middleware.js";
const auth = Router();
auth.post("/signUp", signUp);
auth.post("/signIn", signIn);
// Same handler as /signOut: both only need to clear the session cookie.
auth.post("/logout", signOut);
auth.post("/signOut", signOut);
auth.post("/verifyOtp", verifyOtp);
auth.post("/resendOtp", resendOtp);
// Password reset: request a code, confirm it, then set the new password.
auth.post("/forgotPassword", forgotPassword);
auth.post("/verifyResetOtp", verifyResetOtp);
auth.post("/resetPassword", resetPassword);
auth.get("/userProfile", authmiddleware, userProfile);
export default auth;
//# sourceMappingURL=user.route.js.map