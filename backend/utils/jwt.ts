import jwt from "jsonwebtoken";








export const tokenGenerator = (payload: object, secret: string): string => {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};


export const verifyToken = (token: string, secret: string): jwt.JwtPayload | string => {
  return jwt.verify(token, secret);
};