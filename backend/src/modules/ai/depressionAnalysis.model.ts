import mongoose, { Schema } from 'mongoose';

const depressionAnalysisSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    depressionScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ['low', 'moderate', 'high'], required: true },
}, { timestamps: true });

export const DepressionAnalysis = mongoose.model('DepressionAnalysis', depressionAnalysisSchema);
