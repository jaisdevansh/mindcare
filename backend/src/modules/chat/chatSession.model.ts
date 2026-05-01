import mongoose, { Schema } from 'mongoose';

const chatSessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    helperId: { type: Schema.Types.ObjectId, ref: 'Helper' }, // assigned helper
    type: { type: String, enum: ['ai', 'human'], default: 'ai' },
    subject: { type: String }, // The user's initial concern or message
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    status: { type: String, enum: ['active', 'closed', 'pending'], default: 'active' },
}, { timestamps: true });

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
