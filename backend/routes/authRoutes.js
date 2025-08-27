const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const{ registerUser, loginUser, getUserInfo } = require('../controllers/authController');
const { verifyOtp } = require('../controllers/verifyOtpController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/verify-otp", verifyOtp);
router.get("/userInfo", protect ,getUserInfo);


router.post("/upload-image", upload.single('image'), (req, res) => {
    console.log(req.files); 
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({imageUrl});
});

module.exports = router;
