import { Router } from "express";
import { addProperty } from "../controller/property.controller";
import { authmiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { fetchProperties } from "../controller/property.controller";

const property = Router()

property.post("/addProperty", authmiddleware, upload.array("images", 5), addProperty)

property.get("/fetchProperties", fetchProperties)

export default property