








import { Router } from "express";
import { verifyOtp, signUp } from "../controller/user.controller";


const user = Router();


user.post("/signUp", signUp)
user.post("/verifyOtp", verifyOtp)


export default user