








import { Router } from "express";
import { verifyOtp, signUp, signIn, signOut } from "../controller/user.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { userProfile } from "../controller/user.controller";


const auth = Router();


auth.post("/signUp", signUp)
auth.post("/signIn", signIn)
auth.post("/signOut", signOut)
auth.post("/verifyOtp", verifyOtp)
auth.get("/userProfile", authmiddleware, userProfile)


export default auth