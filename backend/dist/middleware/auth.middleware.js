import env from "../config/env";
import { verifyToken } from "../utils/jwt";
export const authmiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log(req.headers.cookie);
    console.log(req.cookies);
    if (!token) {
        return res.status(404).json({ message: "no token" });
    }
    try {
        const decodedjwt = verifyToken(token, env.jwtSecret);
        req.user = decodedjwt;
        next();
    }
    catch (error) {
        console.log("this error is from the authmiddleware catch: ", error);
    }
};
//# sourceMappingURL=auth.middleware.js.map