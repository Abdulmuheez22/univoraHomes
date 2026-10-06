import env from "../config/env";
import { verifyToken } from "../utils/jwt";
export const authmiddleware = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(req.headers.cookie);
    // console.log(req.cookies);
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
    }
    catch (error) {
        console.log("this error is from the authmiddleware catch: ", error);
        // Must respond, otherwise the request hangs forever and the client
        // spins until it times out (e.g. an expired token).
        return res.status(401).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=auth.middleware.js.map