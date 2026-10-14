import type { Request, Response, NextFunction } from "express";
import env from "../config/env.js";
import { verifyToken } from "../utils/jwt.js";

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
  required: boolean,
) => {
  const authorization = req.get("authorization");
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  const bearerToken = bearerMatch?.[1]?.trim();
  const token = authorization ? bearerToken : req.cookies.token;

  if (!token) {
    if (!required && !authorization) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedjwt = verifyToken(token, env.jwtSecret);
    if (typeof decodedjwt === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // A password reset token is signed with the same secret, so it must be
    // refused here — it is only meant for /auth/resetPassword.
    if (decodedjwt.purpose === "password-reset") {
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

export const authmiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => authenticate(req, res, next, true);

export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => authenticate(req, res, next, false);
