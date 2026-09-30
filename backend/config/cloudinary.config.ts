// backend/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import env from "./env";

cloudinary.config({
  cloud_name: env.cloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export default cloudinary;