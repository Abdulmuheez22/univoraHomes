import {notifyTenantEmailTemplate, notifyTenantEmailOnDecline} from "./notifyTenantEmailTemplate";
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



export const notifyTenant = async (tenantEmail: string, tenantName: string, propertyName: string, propertyAddress: string) => {
  try {
    const info = await transporter.sendMail({
      from: `<${env.appEmail}>`,
      to: tenantEmail,
      subject: "Property Review Notice",
      html: notifyTenantEmailTemplate(tenantName, propertyName, propertyAddress) 
    })
    
  } catch (error) {
    console.log('this error is from notifyTenant catch: ', error)
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

export const notifyTenantOnDecline = async (tenantEmail: string, tenantName: string, propertyName: string, propertyAddress: string) => {
  try {
    const info = await transporter.sendMail({
      from: `<${env.appEmail}>`,
      to: tenantEmail,
      subject: "Request Status Update",
      html: notifyTenantEmailOnDecline(tenantName, propertyName, propertyAddress) 
    })
  } catch (error) {
    console.log('this error is from notifyTenantOnDecline catch: ', error)
  }
}