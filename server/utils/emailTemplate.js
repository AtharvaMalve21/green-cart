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

export const orderPlacedEmailTemplate = (
  username,
  orderId,
  totalAmount,
  shippingAddress
) => {
  const { firstName, lastName, email, street, state, zipcode, phone } =
    shippingAddress;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3fdf5; padding: 30px; color: #2e7d32;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #388e3c; text-align: center;">🌿 Green-Cart Order Confirmation</h2>
        
        <p>Hello <strong>${username}</strong>,</p>
        <p>Thank you for your order! Your order has been successfully placed and is now being processed. 🌱</p>

        <h3 style="color: #2e7d32;">📦 Order Summary</h3>
        <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
            <td style="padding: 8px 0;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Total Amount:</strong></td>
            <td style="padding: 8px 0;">₹${totalAmount}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Payment Status:</strong></td>
            <td style="padding: 8px 0;">Pending</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Order Status:</strong></td>
            <td style="padding: 8px 0;">Processing</td>
          </tr>
        </table>

        <h3 style="color: #2e7d32;">🚚 Shipping Address</h3>
        <p style="line-height: 1.6; margin: 0 0 10px 0;">
          ${firstName} ${lastName}<br/>
          ${street}<br/>
          ${state}, ${zipcode}<br/>
          ${email}<br/>
          📞 ${phone}
        </p>

        <p style="margin-top: 30px;">We’ll send you another email when your items are on the way!</p>

        <p style="margin-top: 30px;">Thank you for shopping with <strong style="color: #1b5e20;">Green-Cart</strong>! 💚</p>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #c8e6c9;" />

        <footer style="font-size: 13px; color: #666; text-align: center;">
          Need help? Contact our <a href="${process.env.CLIENT_URI}/support" style="color: #2e7d32; text-decoration: underline;">support team</a>.
        </footer>
      </div>
    </div>
  `;
};
