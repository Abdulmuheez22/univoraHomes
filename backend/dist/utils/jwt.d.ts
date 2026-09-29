import jwt from "jsonwebtoken";
export declare const tokenGenerator: (payload: object, secret: string) => string;
export declare const verifyToken: (token: string, secret: string) => jwt.JwtPayload | string;
//# sourceMappingURL=jwt.d.ts.map