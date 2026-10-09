import { Router } from "express";
import { authmiddleware } from "../middleware/auth.middleware";
import {
  connectionRequest,
  getConnectionRequestStatus,
  getTenantConnectionRequests,
} from "../controller/connection.controller";
import { updateLandLordConnectionRequest } from "../controller/connection.controller";

const connection = Router()

connection.post("/connectionRequest", authmiddleware, connectionRequest)
connection.get(
  "/connectionRequest/status/:propertyId",
  authmiddleware,
  getConnectionRequestStatus,
)
connection.get(
  "/myConnectionRequests",
  authmiddleware,
  getTenantConnectionRequests,
)

connection.get("/updateLandLordConnectionRequest", authmiddleware, updateLandLordConnectionRequest)

export default connection