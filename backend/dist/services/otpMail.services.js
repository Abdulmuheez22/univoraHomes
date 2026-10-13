import { notifyTenantEmailTemplate, notifyTenantEmailOnDecline } from "./notifyTenantEmailTemplate.js";
import transporter from "../config/mailer.js";
import env from "../config/env.js";
import htmlTemplate from "./notifyLandlordEmailTemplat.servises.js";
export const sendOtpEmail = async (userEmail, otp) => {
    const info = await transporter.sendMail({
        from: `<${env.appEmail}>`,
        to: userEmail,
        subject: "OTP VERIFICATION",
        html: `<b>Your verification code is: ${otp}</b>`,
    });
    console.log("Message sent: %s", info.message);
};
export const notifyTenant = async (tenantEmail, tenantName, propertyName, propertyAddress) => {
    try {
        const info = await transporter.sendMail({
            from: `<${env.appEmail}>`,
            to: tenantEmail,
            subject: "Property Review Notice",
            html: notifyTenantEmailTemplate(tenantName, propertyName, propertyAddress)
        });
    }
    catch (error) {
        console.log('this error is from notifyTenant catch: ', error);
    }
};
export const notifyLandlord = async (userEmail, landlordName, tenantName, propertyName) => {
    try {
        const info = await transporter.sendMail({
            from: `<${env.appEmail}>`,
            to: userEmail,
            subject: "Property request Notification",
            html: htmlTemplate(landlordName, tenantName, propertyName)
        });
    }
    catch (error) {
        console.log('error notifying Landlord');
    }
};
export const notifyTenantOnDecline = async (tenantEmail, tenantName, propertyName, propertyAddress) => {
    try {
        const info = await transporter.sendMail({
            from: `<${env.appEmail}>`,
            to: tenantEmail,
            subject: "Request Status Update",
            html: notifyTenantEmailOnDecline(tenantName, propertyName, propertyAddress)
        });
    }
    catch (error) {
        console.log('this error is from notifyTenantOnDecline catch: ', error);
    }
};
//# sourceMappingURL=otpMail.services.js.map