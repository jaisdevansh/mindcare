import mongoose from 'mongoose';

const aiChatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
}, { timestamps: true });

export const AIChat = mongoose.model('AIChat', aiChatSchema);
