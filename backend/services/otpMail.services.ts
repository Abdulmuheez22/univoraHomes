import {
  notifyTenantEmailTemplate,
  notifyTenantEmailOnDecline,
} from "./notifyTenantEmailTemplate.js";
import transporter from "../config/mailer.js";
import htmlTemplate from "./notifyLandlordEmailTemplat.servises.js";

const FROM = `"UnivoraHomes" <${process.env.MAIL_FROM}>`;

export const sendOtpEmail = async (userEmail: string, otp: string) => {
  const info = await transporter.sendMail({
    from: FROM,
    to: userEmail,
    subject: "OTP VERIFICATION",
    html: `<b>Your verification code is: ${otp}</b>`,
  });

  console.log("Message sent: %s", info.messageId);
};

export const sendPasswordResetEmail = async (
  userEmail: string,
  otp: string,
) => {
  const info = await transporter.sendMail({
    from: FROM,
    to: userEmail,
    subject: "PASSWORD RESET CODE",
    html: `<b>Your password reset code is: ${otp}</b><p>This code expires in 10 minutes. If you did not request it, you can safely ignore this email.</p>`,
  });

  console.log("Message sent: %s", info.messageId);
};

export const notifyTenant = async (
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  propertyAddress: string,
) => {
  try {
    await transporter.sendMail({
      from: FROM,
      to: tenantEmail,
      subject: "Property Review Notice",
      html: notifyTenantEmailTemplate(
        tenantName,
        propertyName,
        propertyAddress,
      ),
    });
  } catch (error) {
    console.log("this error is from notifyTenant catch: ", error);
  }
};

export const notifyLandlord = async (
  userEmail: string,
  landlordName: string,
  tenantName: string,
  propertyName: string,
) => {
  try {
    await transporter.sendMail({
      from: FROM,
      to: userEmail,
      subject: "Property request Notification",
      html: htmlTemplate(landlordName, tenantName, propertyName),
    });
  } catch (error) {
    console.log("error notifying Landlord: ", error);
  }
};

export const notifyTenantOnDecline = async (
  tenantEmail: string,
  tenantName: string,
  propertyName: string,
  propertyAddress: string,
) => {
  try {
    await transporter.sendMail({
      from: FROM,
      to: tenantEmail,
      subject: "Request Status Update",
      html: notifyTenantEmailOnDecline(
        tenantName,
        propertyName,
        propertyAddress,
      ),
    });
  } catch (error) {
    console.log("this error is from notifyTenantOnDecline catch: ", error);
  }
};