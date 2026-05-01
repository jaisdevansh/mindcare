import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createNotification } from '../notifications/notification.service';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Pricing (in paise — multiply ₹ by 100)
const PRICING = {
    chat: 1000,   // ₹10
    call: 3000,   // ₹30 per half hour
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, helperId } = req.body; // type: 'chat' | 'call'

        if (!type || !PRICING[type as keyof typeof PRICING]) {
            res.status(400).json({ success: false, message: 'Invalid session type' });
            return;
        }

        const amount = PRICING[type as keyof typeof PRICING];

        const order = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `mc_${type}_${(helperId || '').slice(-8)}_${Date.now()}`,
            notes: {
                type,
                helperId,
                userId: (req as any).user?._id?.toString() || '',
            },
        });

        res.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
            },
        });
    } catch (err: any) {
        console.error('Razorpay create order error:', err);
        res.status(500).json({ success: false, message: err.message || 'Payment gateway error' });
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, helperId } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSig = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body)
            .digest('hex');

        if (expectedSig !== razorpay_signature) {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
            return;
        }

        const userId = (req as any).user?._id || (req as any).user?.id;

        // Payment verified — return session access token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // Trigger notification
        if (userId) {
            await createNotification(
                userId.toString(),
                'Payment Successful',
                `Your payment for the ${type} session was successful. You can now start the session.`,
                'payment',
                '/helpers'
            );
        }

        res.json({
            success: true,
            message: 'Payment verified',
            data: {
                paymentId: razorpay_payment_id,
                type,
                helperId,
                sessionToken: crypto.randomBytes(32).toString('hex'),
            },
        });
    } catch (err: any) {
        console.error('Razorpay verify error:', err);
        res.status(500).json({ success: false, message: err.message || 'Verification error' });
    }
};
