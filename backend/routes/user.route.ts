
import { Router } from "express";
import {
  verifyOtp,
  signUp,
  signIn,
  signOut,
  resendOtp,
  userProfile,
} from "../controller/user.controller";
import { authmiddleware } from "../middleware/auth.middleware";


const auth = Router();


auth.post("/signUp", signUp);

auth.post("/signIn", signIn);

auth.post("/signOut", signOut);

auth.post("/verifyOtp", verifyOtp);

auth.post("/resendOtp", resendOtp);

auth.get("/userProfile", authmiddleware, userProfile);

export default auth;