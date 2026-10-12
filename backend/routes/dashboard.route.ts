import { Router } from "express";
import { deleteUserAccount, populateDashboard, updateUserProfile, userProfile } from "../controller/dashboard.controller";
import { authmiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware";
import { fetchSavedProperties, fetchLandlordTenant, fetchTenantLandLord, switchRole } from "../controller/dashboard.controller";


const dashboard = Router()

dashboard.get("/populateDashboard", authmiddleware, populateDashboard)

dashboard.get("/userProfile", authmiddleware, userProfile)

dashboard.patch("/userProfile", authmiddleware, updateUserProfile)

dashboard.delete("/userProfile", authmiddleware, deleteUserAccount)

dashboard.get("/fetchSavedProperties", optionalAuthMiddleware, fetchSavedProperties)

dashboard.get("/fetchLandlordTenant", authmiddleware, fetchLandlordTenant)

dashboard.get("/fetchTenantLandLord", authmiddleware, fetchTenantLandLord)

dashboard.post("/switchRole", authmiddleware, switchRole)


export default dashboard