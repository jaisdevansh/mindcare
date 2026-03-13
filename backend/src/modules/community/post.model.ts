import mongoose, { Schema } from 'mongoose';

const replySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    replies: [replySchema],
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
