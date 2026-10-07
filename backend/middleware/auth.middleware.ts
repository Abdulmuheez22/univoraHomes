import type { Request, Response, NextFunction } from "express";
import env from "../config/env";
import { verifyToken } from "../utils/jwt";

export const authmiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.get("authorization");
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  const bearerToken = bearerMatch?.[1]?.trim();
  const token = authorization ? bearerToken : req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedjwt = verifyToken(token, env.jwtSecret);
    if (typeof decodedjwt === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decodedjwt;
    next();
  } catch (error) {
    console.log("this error is from the authmiddleware catch: ", error);
    // Must respond, otherwise the request hangs forever and the client
    // spins until it times out (e.g. an expired token).
    return res.status(401).json({ message: "Unauthorized" });
  }
};
