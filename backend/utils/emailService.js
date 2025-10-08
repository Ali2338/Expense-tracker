// backend/utils/emailService.js
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Generate a 6-digit OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Send OTP email
const sendOtp = async (email, otp) => {
  console.log(`📧 Sending OTP via Gmail to: ${email}, OTP: ${otp}`);

  const mailOptions = {
    from: `"Smart Expense Tracker" <${process.env.GMAIL_USER}>`,
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
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent successfully via Gmail");
  } catch (error) {
    console.error("❌ Failed to send OTP via Gmail:", error);
    throw new Error("Email send failed");
  }
};

module.exports = { generateOtp, sendOtp };
