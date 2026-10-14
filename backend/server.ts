import express from "express";
import env from "./config/env.js";
import cors from "cors";
import user from "./routes/user.route.js";
import dashboard from "./routes/dashboard.route.js";
import { showReqMethod } from "./middleware/logger.middleware.js";
import cookieParser from "cookie-parser";
import property from "./routes/propety.route.js";
import connection from "./routes/connection.route.js";

const app = express();

const port = env.port;

const frontendUrl = env.frontendUrl;
// const allowedOrigins = new Set(
//   [
//     frontendUrl,
//     "http://localhost:5173",
//     "http://localhost:5174",
//     "univora-homes.vercel.app",
//   ].filter(Boolean),
// );

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
origin: [env.frontendUrl, "https://univora-homes.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(showReqMethod);
app.use("/api/auth", user);
app.use("/api/dashboard", dashboard);
app.use("/api/property", property);
app.use("/api/connection", connection);


app.listen(port, () => {
  console.log(`univoraHomes is running on http://localhost:${port}`);
});
