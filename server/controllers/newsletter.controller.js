import transporter from "../config/nodemailer.config.js";
import { newsLetterEmailTemplate } from "../utils/emailTemplate.js";

export const sendMessage = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email field is required.",
      });
    }

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Thanks for Subscribing – Exciting Things Ahead!",
      html: newsLetterEmailTemplate(email),
    });

    return res.status(200).json({
      success: true,
      message:
        "Subscription successful! You’ll now receive our latest updates and offers.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
