import { Router } from "express";
import { populateDashboard, userProfile } from "../controller/dashboard.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { fetchSavedProperties, fetchLandlordTenant, fetchTenantLandLord } from "../controller/dashboard.controller";


const dashboard = Router()

dashboard.get("/populateDashboard", authmiddleware, populateDashboard)

dashboard.get("/userProfile", authmiddleware, userProfile)

dashboard.get("/fetchSavedProperties", authmiddleware, fetchSavedProperties)

dashboard.get("/fetchLandlordTenant", authmiddleware, fetchLandlordTenant)

dashboard.get("/fetchTenantLandLord", authmiddleware, fetchTenantLandLord)


export default dashboard