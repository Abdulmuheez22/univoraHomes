import express from "express";
import env from "./config/env";
import cors from "cors";
import user from "./routes/user.route";
import dashboard from "./routes/dashboard.route";
import { showReqMethod } from "./middleware/logger.middleware";
import cookieParser from "cookie-parser";
const app = express();
const port = env.port;
const frontendUrl = env.frontendUrl;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(showReqMethod);
app.use("/api/auth", user);
app.use("/api/dashboard", dashboard);
app.listen(port, () => {
    console.log(`univoraHomes is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map