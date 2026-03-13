import mongoose from 'mongoose';

const emotionLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    detectedMood: { type: String, required: true },
    confidenceScore: { type: Number, default: 0 },
    source: { type: String, enum: ['assignment', 'ai-chat', 'manual'], default: 'assignment' },
}, { timestamps: true });

export const EmotionLog = mongoose.model('EmotionLog', emotionLogSchema);
