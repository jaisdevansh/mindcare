import mongoose, { Schema } from 'mongoose';

const chatSessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    helperId: { type: Schema.Types.ObjectId, ref: 'Helper' }, // null for AI sessions
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
}, { timestamps: true });

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
