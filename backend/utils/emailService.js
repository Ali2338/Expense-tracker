// backend/utils/emailService.js
const { Resend } = require("resend");
const crypto = require("crypto");

// Initialize Resend with API Key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a 6-digit OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Send OTP email
const sendOtp = async (email, otp) => {
  console.log(`📧 Sending OTP via Resend to: ${email}, OTP: ${otp}`);

  try {
    await resend.emails.send({
      from: "Smart Expense Tracker <onboarding@resend.dev>", 
      // Later you can replace this with your own domain email like noreply@expensetracker.com
      to: email,
      subject: "Your OTP Code - Smart Expense Tracker",
      html: `
        <h3>Smart Expense Tracker - OTP Verification</h3>
        <p>Hello,</p>
        <p>Your One-Time Password is:</p>
        <h2 style="color:#2e86de;">${otp}</h2>
        <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
        <br/>
        <small>Sent securely from Smart Expense Tracker</small>
      `,
    });

    console.log("✅ OTP sent successfully via Resend");
  } catch (error) {
    console.error("❌ Failed to send OTP via Resend:", error);
    throw new Error("Email send failed");
  }
};

module.exports = { generateOtp, sendOtp };
