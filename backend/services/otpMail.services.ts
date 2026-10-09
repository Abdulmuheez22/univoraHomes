
import transporter from "../config/mailer";
import env from "../config/env";
import htmlTemplate from "./notifyLandlordEmailTemplat.servises";


export const sendOtpEmail = async (userEmail: string, otp: string) => {
try {
  const info = await transporter.sendMail({
    from: `<${env.appEmail}>`, // sender address
    to: userEmail, // list of recipients
    subject: "OTP VERIFICATION", // subject line
    // text: 'Your verification code is: ${otp}', // plain text body
    html: `<b>Your verification code is: ${otp}</b>`, // HTML body
  });

  console.log("Message sent: %s", info.message);
} catch (err) {
  console.error("Error while sending mail:", err);
}
}



export const notifyLandlord = async (userEmail: string, landlordName: string, tenantName: string, propertyName: string) => {
  try {
    const info = await transporter.sendMail({
      from: `<${env.appEmail}>`,
      to: userEmail,
      subject: "Property request Notification",
      html:  htmlTemplate(landlordName, tenantName, propertyName)
    })



  } catch (error) {
    console.log('error notifying Landlord')
  }
}