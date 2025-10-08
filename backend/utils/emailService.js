const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Generate a 6-digit OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Configure Brevo (Sendinblue) SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587, // TLS port
  secure: false, // use STARTTLS instead of SSL
  auth: {
    user: process.env.EMAIL_USER, // your Brevo account email
    pass: process.env.EMAIL_PASS, // your Brevo SMTP key
  },
});

// Send OTP email
const sendOtp = async (email, otp) => {
  console.log(`📧 Sending OTP via Brevo to: ${email}, OTP: ${otp}`);

  const mailOptions = {
    from: `"Smart Expense Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code - Smart Expense Tracker",
    html: `
      <h3>Smart Expense Tracker - OTP Verification</h3>
      <p>Hello,</p>
      <p>Your One-Time Password is:</p>
      <h2 style="color:#2e86de;">${otp}</h2>
      <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
      <br/>
      <small>Sent securely via Brevo SMTP</small>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent successfully via Brevo");
  } catch (error) {
    console.error("❌ Failed to send OTP via Brevo:", error);
    throw new Error("Email send failed");
  }
};

module.exports = { generateOtp, sendOtp };
