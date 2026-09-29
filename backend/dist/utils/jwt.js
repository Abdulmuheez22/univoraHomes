import jwt from "jsonwebtoken";
export const tokenGenerator = (payload, secret) => {
    return jwt.sign(payload, secret, { expiresIn: "7d" });
};
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};
//# sourceMappingURL=jwt.js.map