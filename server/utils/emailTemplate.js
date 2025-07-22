import dotenv from "dotenv";
dotenv.config();

export const newsLetterEmailTemplate = (userEmail) => {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Newsletter Subscription</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial, sans-serif;">
    <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f9f9f9;padding:20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding:30px 40px;text-align:center;">
                <h1 style="margin:0;font-size:24px;color:#2c3e50;">Thank You for Subscribing! 🎉</h1>
                <p style="font-size:16px;line-height:1.6;color:#555;margin-top:20px;">
                  Hello <strong>${userEmail}</strong>,
                </p>
                <p style="font-size:16px;line-height:1.6;color:#555;">
                  You've successfully subscribed to our newsletter. We’re excited to share our latest updates, exclusive offers, and exciting content with you.
                </p>
                <p style="font-size:16px;line-height:1.6;color:#555;">
                  Stay tuned and thank you for joining our community!
                </p>
                <a href="${process.env.CLIENT_URI}" target="_blank" style="display:inline-block;margin-top:30px;padding:12px 24px;background-color:#22c55e;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
                  Visit Our Website
                </a>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f0f0f0;padding:20px;text-align:center;color:#888;font-size:13px;">
                You are receiving this email because you subscribed to our newsletter.<br/>
                If this was a mistake, you can ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
