








import { Router } from "express";
import { verifyOtp, signUp, signIn } from "../controller/user.controller";


const auth = Router();


auth.post("/signUp", signUp)
auth.post("/signIn", signIn)
auth.post("/verifyOtp", verifyOtp)


export default auth