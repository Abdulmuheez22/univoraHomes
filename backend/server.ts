



















import express from "express";
import env from "./config/env"
import cors from "cors"
import user from "./routes/user.route";
import dashboard from "./routes/dashboard.route";
import { showReqMethod } from "./middleware/logger.middleware";
import cookieParser from "cookie-parser";
import property from "./routes/propety.route";

const app = express();

const port:number = env.port
const frontendUrl = env.frontendUrl
const allowedOrigins = new Set([
  frontendUrl,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean));

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
}))
app.use(showReqMethod)
app.use("/api/auth", user)
app.use("/api/dashboard", dashboard)
app.use("/api/property", property)


app.listen(port, () => {
    console.log(`univoraHomes is running on http://localhost:${port}`)
})