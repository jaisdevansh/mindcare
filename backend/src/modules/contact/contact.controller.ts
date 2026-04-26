import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, reason, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ success: false, message: 'Name, email and message are required' });
            return;
        }

        await transporter.sendMail({
            from: `"MindCare Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `[MindCare Contact] ${reason || 'General'} — from ${name}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:12px;">
                    <h2 style="color:#7C5CFF;margin-bottom:4px;">New Contact Message</h2>
                    <p style="color:#64748b;margin-top:0;font-size:13px;">via MindCare Support Form</p>
                    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                        <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;font-weight:bold;">${name}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:8px 0;font-weight:bold;">${email}</td></tr>
                        <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Reason</td><td style="padding:8px 0;">${reason || 'General Inquiry'}</td></tr>
                    </table>
                    <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-top:8px;">
                        <p style="margin:0;white-space:pre-line;color:#1e293b;">${message}</p>
                    </div>
                </div>`,
        });

        // Auto-reply to sender
        await transporter.sendMail({
            from: `"MindCare Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'We received your message — MindCare',
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:12px;">
                    <h2 style="color:#7C5CFF;">Hi ${name},</h2>
                    <p>Thanks for reaching out to MindCare! We've received your message and will get back to you within <strong>2 hours</strong>.</p>
                    <p style="color:#64748b;font-size:13px;">Your message: <em>${message.slice(0, 200)}${message.length > 200 ? '…' : ''}</em></p>
                    <p>With care,<br/><strong>The MindCare Team</strong></p>
                </div>`,
        });

        res.json({ success: true, message: 'Message sent! We\'ll reply within 2 hours.' });
    } catch (err: any) {
        console.error('Contact email error:', err);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
};
