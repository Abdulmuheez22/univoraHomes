



















import express from "express";
import env from "./config/env"
import cors from "cors"
import user from "./routes/user.route";
import { showReqMethod } from "./middleware/logger.middleware";
import { verifyOtp } from "./controller/user.controller";


const app = express();

const port:number = env.port
const frontendUrl = env.frontendUrl


app.use(express.json())
app.use(cors({ origin: frontendUrl, credentials: true}))
app.use(showReqMethod)
app.use("/createUser", user)
app.use("/verifyOtp", verifyOtp)


app.listen(port, () => {
    console.log(`univoraHomes is running on http://localhost:${port}`)
})