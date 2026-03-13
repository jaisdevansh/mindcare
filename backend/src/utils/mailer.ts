import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    secure: env.emailPort === 465, // true for 465, false for other ports
    auth: {
        user: env.emailUser,
        pass: env.emailPass,
    },
});

export const sendVerificationEmail = async (email: string, token: string, otp: string) => {
    const verificationLink = `${env.frontendUrl}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"MindCare" <${env.emailUser}>`,
        to: email,
        subject: 'Verify your MindCare account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4F46E5; text-align: center;">Welcome to MindCare</h2>
                <p>Hello,</p>
                <p>Thank you for joining MindCare. Please verify your account to get started.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Account</a>
                </div>
                
                <p>Or use the OTP code below (expires in 10 minutes):</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b; background: #f1f5f9; padding: 10px 20px; border-radius: 5px;">${otp}</span>
                </div>
                
                <p style="font-size: 12px; color: #64748b; margin-top: 40px;">
                    Verification link expires in 30 minutes. If you did not create an account, please ignore this email.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetLink = `${env.frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"MindCare Support" <${env.emailUser}>`,
        to: email,
        subject: 'Reset your MindCare Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4F46E5; text-align: center;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your MindCare account. Click the button below to set a new password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                
                <p style="font-size: 12px; color: #64748b; margin-top: 40px;">
                    This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent to ${email}`);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Failed to send reset password email');
    }
};
