import mongoose, { Schema } from 'mongoose';

const helperSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    otpCode: { type: String },
    otpExpiry: { type: Date },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

export const Helper = mongoose.model('Helper', helperSchema);
