import mongoose, { Schema } from 'mongoose';

const moodLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    detectedMood: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
}, { timestamps: true });

export const MoodLog = mongoose.model('MoodLog', moodLogSchema);
