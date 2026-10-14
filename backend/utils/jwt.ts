import jwt from "jsonwebtoken";








/* Session tokens live for weeks so a signed-in user is not thrown back to the
   sign-in page mid-visit. Short-lived tokens (the password reset token) pass
   their own expiry instead. */
const SESSION_LIFETIME = "30d";

export const tokenGenerator = (
  payload: object,
  secret: string,
  expiresIn: string = SESSION_LIFETIME,
): string => {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};


export const verifyToken = (token: string, secret: string): jwt.JwtPayload | string => {
  return jwt.verify(token, secret);
};