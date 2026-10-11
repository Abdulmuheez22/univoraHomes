import { Router } from "express";
import { verifyOtp, signUp, signIn, signOut } from "../controller/user.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { userProfile, editProfile } from "../controller/user.controller";
const auth = Router();
auth.post("/signUp", signUp);
auth.post("/signIn", signIn);
auth.post("/signOut", signOut);
auth.post("/verifyOtp", verifyOtp);
auth.get("/userProfile", authmiddleware, userProfile);
auth.patch("/editProfile", authmiddleware, editProfile);
export default auth;
//# sourceMappingURL=user.route.js.map