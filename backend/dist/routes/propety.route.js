import { Router } from "express";
import { addProperty, deleteLandlordProperty, updateLandlordProperty, } from "../controller/property.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { fetchProperties, fetchPropertyById, saveProperty } from "../controller/property.controller";
import { landLordProperties } from "../controller/property.controller";
import { unSaveProperty } from "../controller/property.controller";
const property = Router();
property.post("/addProperty", authmiddleware, upload.array("images", 5), addProperty);
property.get("/fetchProperties", fetchProperties);
property.get("/fetchProperties/:propertyId", fetchPropertyById);
property.get("/fetchLandLordProperties", authmiddleware, landLordProperties);
property.patch("/landlord/:propertyId", authmiddleware, upload.array("images", 5), updateLandlordProperty);
property.delete("/landlord/:propertyId", authmiddleware, deleteLandlordProperty);
property.post("/saveProperty", authmiddleware, saveProperty);
property.delete("/unSaveProperty/:id", authmiddleware, unSaveProperty);
export default property;
//# sourceMappingURL=propety.route.js.map