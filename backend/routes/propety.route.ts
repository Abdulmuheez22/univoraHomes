import { Router } from "express";
import { addProperty } from "../controller/property.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const property = Router()

property.post("/addProperty", authmiddleware, upload.single("image"), addProperty)

export default property