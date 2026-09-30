import dotenv from "dotenv"
import { string } from "drizzle-orm/cockroach-core"


dotenv.config()







const env: {
    port: number,
    dbURL: string,
    jwtSecret: string,
    appEmail: string,
    appPassword: string,
    frontendUrl: string,
    cloudName: string,
    cloudinaryApiKey: string,
    cloudinaryApiSecret: string,
    cloudinaryUrl: string
} = {
    port: Number(process.env.PORT),
    dbURL: String( process.env.DATABASE_URL),
    jwtSecret: String(process.env.JWT_SECRET),
    appEmail: String(process.env.SMTP_USER),
    appPassword: String(process.env.SMTP_PASS),
    frontendUrl: String(process.env.FRONTEND_URL),
    cloudName: String(process.env.CLOUD_NAME),
    cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY),
    cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
    cloudinaryUrl: String(process.env.CLOUDINARY_URL)

}

export default env