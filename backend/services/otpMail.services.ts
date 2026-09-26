
import transporter from "../config/mailer";
import env from "../config/env";



export const sendOtpEmail = async (userEmail: string, otp: string) => {
try {
  const info = await transporter.sendMail({
    from: `My App" <${env.appEmail}>`, // sender address
    to: userEmail, // list of recipients
    subject: "OTP VERIFICATION", // subject line
    text: 'Your verification code is: ${otp}', // plain text body
    html: '<b>Your verification code is: ${otp}</b>', // HTML body
  });

  console.log("Message sent: %s", info.messageId);
} catch (err) {
  console.error("Error while sending mail:", err);
}
}