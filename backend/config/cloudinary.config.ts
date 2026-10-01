// backend/config/cloudinary.ts
import env from "./env";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: env.cloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export default cloudinary;