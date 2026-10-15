import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

const transportOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = nodemailer.createTransport(transportOptions as any);

export default transporter;
