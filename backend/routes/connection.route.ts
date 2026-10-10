import { Router } from "express";
import { authmiddleware } from "../middleware/auth.middleware";
import {  connectionRequest,  getConnectionRequestStatus,  getTenantConnectionRequests,} from "../controller/connection.controller";
import {
  acceptConnectionRequest,
  declineConnectionRequest,
  updateLandLordConnectionRequest,
} from "../controller/connection.controller";

const connection = Router()

connection.post("/connectionRequest", authmiddleware, connectionRequest)

connection.get(  "/connectionRequest/status/:propertyId",  authmiddleware,  getConnectionRequestStatus,)

connection.get(  "/myConnectionRequests",  authmiddleware,  getTenantConnectionRequests,)

connection.get("/updateLandLordConnectionRequest", authmiddleware, updateLandLordConnectionRequest)

connection.patch(  "/connectionRequest/:requestId",  authmiddleware,  acceptConnectionRequest,)
connection.patch(
  "/connectionRequest/:requestId/decline",
  authmiddleware,
  declineConnectionRequest,
)

export default connection