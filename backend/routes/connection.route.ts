import { Router } from "express";
import { authmiddleware } from "../middleware/auth.middleware";
import { connectionRequest } from "../controller/connection.controller";

const connection = Router()

connection.post("/connectionRequest", authmiddleware, connectionRequest)

export default connection