import { Router } from "express";
import { populateDashboard } from "../controller/dashboard.controller";
import { authmiddleware } from "../middleware/auth.middleware";


const dashboard = Router()


dashboard.get("/populateDashboard", authmiddleware, populateDashboard)


export default dashboard