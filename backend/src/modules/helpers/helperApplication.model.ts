import mongoose from 'mongoose';

const helperApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    bio: { type: String, required: true },
    motivation: { type: String, required: true },
    experience: { type: String, required: true },
    specializations: [{ type: String }],
    availability: { type: String, required: true },
    hasTraining: { type: Boolean, default: false },
    trainingDetails: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminNote: { type: String },
    reviewedAt: { type: Date },
}, { timestamps: true });

export const HelperApplication = mongoose.model('HelperApplication', helperApplicationSchema);
