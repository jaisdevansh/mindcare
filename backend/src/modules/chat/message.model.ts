import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true },
    senderType: { type: String, enum: ['user', 'helper', 'ai'], required: true },
    message: { type: String, required: true },
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);
