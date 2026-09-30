import { Router } from "express";
import { addProperty } from "../controller/property.controller";
import { authmiddleware } from "../middleware/auth.middleware";

const property = Router()

property.post("/addProperty", authmiddleware, addProperty)

export default property