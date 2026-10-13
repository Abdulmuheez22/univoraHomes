
import { Router } from "express";
import {
  verifyOtp,
  signUp,
  signIn,
  signOut,
  resendOtp,
  userProfile,
} from "../controller/user.controller.js";
import { googleSignIn } from "../controller/googleAuth.controller.js";
import { authmiddleware } from "../middleware/auth.middleware.js";


const auth = Router();


auth.post("/signUp", signUp);

auth.post("/signIn", signIn);

auth.post("/google", googleSignIn);

// Same handler as /signOut: both only need to clear the session cookie.
auth.post("/logout", signOut);

auth.post("/signOut", signOut);

auth.post("/verifyOtp", verifyOtp);

auth.post("/resendOtp", resendOtp);

auth.get("/userProfile", authmiddleware, userProfile);

export default auth;