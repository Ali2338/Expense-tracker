const axios = require("axios");
const crypto = require("crypto");

// Generate a 6-digit OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Send OTP using Brevo API (HTTPS)
const sendOtp = async (email, otp) => {
  console.log(`📧 Sending OTP via Brevo API to: ${email}, OTP: ${otp}`);

  const brevoApiKey = process.env.BREVO_API_KEY;

  const data = {
    sender: { name: "Smart Expense Tracker", email: "rebook@arhaankhan122334@gmail.com" },
    to: [{ email }],
    subject: "Your OTP Code - Smart Expense Tracker",
    htmlContent: `
      <h3>Smart Expense Tracker - OTP Verification</h3>
      <p>Hello,</p>
      <p>Your One-Time Password is:</p>
      <h2 style="color:#2e86de;">${otp}</h2>
      <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
      <br/>
      <small>Sent securely via Brevo API</small>
    `,
  };

  try {
    const response = await axios.post("https://api.brevo.com/v3/smtp/email", data, {
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log("✅ OTP sent successfully via Brevo API:", response.data.messageId || "Success");
  } catch (error) {
    console.error("❌ Failed to send OTP via Brevo API:", error.response?.data || error.message);
    throw new Error("Email send failed");
  }
};

module.exports = { generateOtp, sendOtp };
