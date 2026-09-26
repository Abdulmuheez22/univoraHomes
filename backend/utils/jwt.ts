import jwt from "jsonwebtoken";








export const tokenGenerator = (payload: object, secret: string): string => {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};
