import mongoose from 'mongoose';

const assignmentResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{ type: String }],
    detectedMood: { type: String },
    confidenceScore: { type: Number, default: 0 },
    depressionScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Low' },
    mentalScore: { type: Number, default: 100 },
    mentalScoreCategory: { type: String, enum: ['High Risk', 'Moderate', 'Healthy'], default: 'Healthy' },
    predictedMood: { type: String },
    predictedMoodConfidence: { type: Number, default: 0 },
    suggestedExercises: [{ type: String }],
    aiSuggestions: [{ type: String }],
    helperRecommended: { type: Boolean, default: false },
}, { timestamps: true });

export const AssignmentResult = mongoose.model('AssignmentResult', assignmentResultSchema);
