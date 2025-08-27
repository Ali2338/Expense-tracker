const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    budgetLimit: { type: Number , default: 0 }, 
    otp: { type: String },
    otpExpires: { type: Date },

},
    { timestamps: true });

//hash password before saving 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare password
userSchema.methods.comparePassword = async function (candidatepassword) {
    return await bcrypt.compare(candidatepassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
