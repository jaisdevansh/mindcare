import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'assessment' | 'payment' | 'community' | 'system' | 'helper';
    read: boolean;
    link?: string;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type:    { type: String, enum: ['assessment', 'payment', 'community', 'system', 'helper'], default: 'system' },
    read:    { type: Boolean, default: false },
    link:    { type: String },
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
