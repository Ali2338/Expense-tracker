const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const { sendOtp, generateOtp } = require('../utils/sendOtp');
// backend/controllers/authController.js
const { generateOtp, sendOtp } = require('../utils/emailService');

//const { sendOtp, generateOtp } = require('../utils/sendOtp'); // Import OTP functions


const generatetoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
}


// controllers/authController.js

exports.registerUser = async (req, res) => {
  const { fullname, email, password, profileImageUrl } = req.body;
  //console.log("Incoming registration data:", req.body);

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const user = await User.create({
      fullname,
      email,
      password,
      profileImageUrl,
      otp,
      otpExpires
    });

    // TRY-CATCH AROUND EMAIL SEND
    try {
      await sendOtp(email, otp);
    } catch (emailErr) {
      console.error("Failed to send OTP:", emailErr);
      return res.status(500).json({ message: "OTP send failed", error: emailErr.message });
    }

    res.status(201).json({ message: "OTP sent to your email. Please verify to complete registration.", userId: user._id });

  } catch (err) {
    console.error("Registration error:", err);  // LOG FULL ERROR
    res.status(500).json({ message: "Error in registration", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtp(email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please verify to continue.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImageUrl: user.profileImageUrl  // 
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Error in login", error: err.message });
  }
};


exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error in getting user info", error: err.message });
  }
}

