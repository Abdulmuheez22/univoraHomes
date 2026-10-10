const notifyTenant = () => {
    return `Put your HTML text here<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Property Has Been Accepted</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F5F0; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 8px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FEFDFC; border-radius: 24px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,51,47,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #00332F; padding: 36px 20px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
 
              </table>
              <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0; letter-spacing: -0.5px;">
                Univora <span style="color: #F59E0B;">Homes</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.7); font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                Property Review Notice
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 24px;">
              
              <!-- Acceptance Status Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 20px; padding: 6px 14px;">
                    <span style="color: #047857; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                      &#10003; Property Accepted
                    </span>
                  </td>
                </tr>
              </table>

              <h2 style="color: #00332F; font-size: 20px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -0.3px;">
                Hi [Tenant Name],
              </h2>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                Good news! Your property, <strong style="color: #00332F;">[Property Name] at [Address]</strong>, has been reviewed and officially accepted on Univora Homes.
              </p>

              <!-- Next Steps Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F5F0; border-radius: 18px; border: 1px solid #E2E8F0; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px 20px;">
                    <p style="color: #00332F; font-size: 12px; text-transform: uppercase; font-weight: 800; margin: 0 0 16px 0; letter-spacing: 0.5px;">
                      What happens next
                    </p>
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" style="width: 24px; padding-bottom: 12px;">
                          <span style="color: #10B981; font-weight: 900; font-size: 14px;">&#10003;</span>
                        </td>
                        <td style="color: #334155; font-size: 14px; font-weight: 600; line-height: 1.4; padding-bottom: 12px;">
                          Your property is now active on your account.
                        </td>
                      </tr>
                      <tr>
                        <td valign="top" style="width: 24px; padding-bottom: 12px;">
                          <span style="color: #10B981; font-weight: 900; font-size: 14px;">&#10003;</span>
                        </td>
                        <td style="color: #334155; font-size: 14px; font-weight: 600; line-height: 1.4; padding-bottom: 12px;">
                          You can log in anytime to view its details.
                        </td>
                      </tr>
                      <tr>
                        <td valign="top" style="width: 24px;">
                          <span style="color: #10B981; font-weight: 900; font-size: 14px;">&#10003;</span>
                        </td>
                        <td style="color: #334155; font-size: 14px; font-weight: 600; line-height: 1.4;">
                          If anything needs to change, just reply to this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="#" target="_blank" style="background-color: #00332F; color: #FFFFFF; padding: 14px 32px; border-radius: 14px; font-size: 14px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(0, 51, 47, 0.25); text-align: center;">
                      Go to Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign Off -->
              <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #F1F5F9;">
                <p style="color: #64748B; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">
                  Thank you for choosing Univora Homes. We're glad to have you with us.
                </p>
                <p style="color: #00332F; font-size: 14px; font-weight: 800; margin: 0; line-height: 1.4;">
                  Best regards,<br>
                  <span style="color: #F59E0B;">Abdulmuheez</span><br>
                  <span style="font-[#64748B] font-size: 12px; font-weight: 600;">Univora Homes</span>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #F7F5F0; padding: 24px; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="color: #94A3B8; font-size: 12px; margin: 0; font-weight: 500;">
                &copy; 2026 Univora Homes. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}