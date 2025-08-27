// backend/utils/emailService.js
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const sendOtp = async (email, otp) => {
  console.log(`Sending OTP to: ${email}, OTP: ${otp}`);
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: `"Smart Expense Tracker OTP Service" <yourgmail@gmail.com>`,
    to: email,
    subject: "Your OTP Code",
    html: `
         <h3>Smart Expense Tracker - OTP Verification</h3>
         <p>Hello,</p>
         <p>Your One-Time Password is:</p>
         <h2 style="color: #2e86de;">${otp}</h2>
         <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
         <p>If you did not request this, you can ignore this message.</p>
         <br>
         <small>Sent securely from Smart Expense Tracker</small>
         `,
     });
    };

module.exports = { generateOtp, sendOtp };
