







 const htmlTemplate = (landlordName: string, tenantName: string, propertyName: string) => {

 return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Interest in Property</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F5F0; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FEFDFC; border-radius: 24px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,51,47,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #00332F; padding: 36px 24px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
               
              </table>
              <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0; letter-spacing: -0.5px;">
                Univora <span style="color: #F59E0B;">Homes</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.7); font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                New Property Interest
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 28px;">
              <h2 style="color: #00332F; font-size: 20px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -0.3px;">
                Hi ${landlordName},
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                <strong style="color: #00332F;">${tenantName}</strong> has expressed direct interest in your listing <strong style="color: #00332F;">${propertyName}</strong>.
              </p>

              <!-- Highlight Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F5F0; border-radius: 16px; border: 1px solid #E2E8F0; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; margin: 0 0 4px 0; letter-spacing: 0.5px;">Action Required</p>
                    <p style="color: #1E293B; font-size: 14px; font-weight: 600; margin: 0; line-height: 1.4;">
                      Log in to your dashboard to review applicant details and accept or decline the request.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="#" target="_blank" style="background-color: #F59E0B; color: #FFFFFF; padding: 14px 32px; border-radius: 14px; font-size: 14px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3); text-align: center; mso-padding-alt: 0;">
                      View Request &rarr;
                    </a>
                  </td>
                </tr>
              </table>
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


export default htmlTemplate