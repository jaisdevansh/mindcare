import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    otpCode: { type: String },
    otpExpiry: { type: Date },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

export const Admin = mongoose.model('Admin', adminSchema);
