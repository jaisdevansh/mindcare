import mongoose, { Schema } from 'mongoose';

const dynamicAssessmentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true, unique: true },
    questions: [{
        questionNumber: Number,
        question: String,
        answer: String,
        detectedMood: String,
        timestamp: { type: Date, default: Date.now }
    }],
    currentQuestionNumber: { type: Number, default: 1 },
    isCompleted: { type: Boolean, default: false },
    finalAnalysis: {
        detectedMood: String,
        confidenceScore: Number,
        depressionScore: Number,
        riskLevel: String,
        mentalScore: Number,
        mentalScoreCategory: String,
        predictedMood: String,
        predictedMoodConfidence: Number,
        suggestedExercises: [String],
        aiSuggestions: [String],
        helperRecommended: Boolean,
    }
}, { timestamps: true });

export const DynamicAssessment = mongoose.model('DynamicAssessment', dynamicAssessmentSchema);
