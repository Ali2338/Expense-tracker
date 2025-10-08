const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOtp, sendOtp } = require('../utils/emailService');


const generatetoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
}


// ✅ Improved version for Render + Gmail reliability
exports.registerUser = async (req, res) => {
  const { fullname, email, password, profileImageUrl } = req.body;

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
      otpExpires,
    });

    // ✅ Send response first to prevent timeout
    res.status(201).json({
      message: "OTP is being sent to your email.",
      userId: user._id,
    });

    // 🔄 Send OTP in background (non-blocking)
    sendOtp(email, otp).catch((err) =>
      console.error("❌ OTP send failed:", err)
    );

  } catch (err) {
    console.error("Registration error:", err);
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

    // ✅ Respond immediately to avoid timeout
    res.status(200).json({
      message: "OTP is being sent to your email.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    });

    // 🔄 Send OTP in background (non-blocking)
    sendOtp(email, otp).catch((err) =>
      console.error("❌ OTP send failed:", err)
    );

  } catch (err) {
    console.error("Login error:", err);
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

