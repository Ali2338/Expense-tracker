const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log("📩 Received OTP verification request for:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "OTP verified successfully", token, user });
  } catch (err) {
    console.error("❌ Error in OTP verification:", err);
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

module.exports = verifyOtp;
