import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT), // Ensure it's a number
      secure: true, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Inngest TMS" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mail error:", error.message);
    throw error;
  }
};
