import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";


const transportOptions = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },};

const transporter = nodemailer.createTransport(transportOptions as any);

export default transporter;
