import { Router } from "express";
import { addProperty } from "../controller/property.controller";

const property = Router()

property.post("/addProperty", addProperty)

export default property