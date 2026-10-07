import { Router } from "express";
import { populateDashboard, userProfile } from "../controller/dashboard.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { fetchSavedProperties } from "../controller/dashboard.controller";


const dashboard = Router()

dashboard.get("/populateDashboard", authmiddleware, populateDashboard)

dashboard.get("/userProfile", authmiddleware, userProfile)

dashboard.get("/fetchSavedProperties", authmiddleware, fetchSavedProperties)


export default dashboard