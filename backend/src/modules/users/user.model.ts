import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    profileImage: { type: String, default: '' },
    bio: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    location: { type: String },
    phoneNumber: { type: String },
    preferredLanguage: { type: String },
    anonymousMode: { type: Boolean, default: false },
    googleId: { type: String },
    githubId: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    otpCode: { type: String },
    otpExpiry: { type: Date },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
