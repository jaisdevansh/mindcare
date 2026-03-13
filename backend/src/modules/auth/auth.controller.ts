import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import passport from 'passport';
import { User } from '../users/user.model';
import { Helper } from '../helpers/helper.model';
import { Admin } from '../admins/admin.model';
import { env } from '../../config/env';
import { sendResponse } from '../../utils/response';
import { sendVerificationEmail, sendResetPasswordEmail } from '../../utils/mailer';
import { AuthRequest } from '../../middleware/auth.middleware';

const getModelByRole = (role: string): any => {
    if (role === 'helper') return Helper;
    if (role === 'admin') return Admin;
    return User;
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, role = 'user' } = req.body;

        if (!name || !email || !password) {
            sendResponse(res, 400, false, 'Please provide all details');
            return;
        }

        const Model = getModelByRole(role);
        const existingUser = await (Model as any).findOne({ email });
        if (existingUser) {
            sendResponse(res, 400, false, 'Email already in use');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate Verification Token and OTP
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUser = new Model({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            verificationToken,
            verificationTokenExpiry,
            otpCode,
            otpExpiry
        });

        await newUser.save();

        // Send Email
        await sendVerificationEmail(email, verificationToken, otpCode);

        sendResponse(res, 201, true, 'Registration successful. Please check your email for verification.');
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query;
        if (!token) {
            sendResponse(res, 400, false, 'Verification token is required');
            return;
        }

        const role = (req.query.role as string) || 'user';
        const Model = getModelByRole(role);

        const user = await (Model as any).findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() }
        });
        if (!user) {
            sendResponse(res, 400, false, 'Invalid or expired verification token');
            return;
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        sendResponse(res, 200, true, 'Email verified successfully. You can now login.');
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, otp, role = 'user' } = req.body;
        if (!email || !otp) {
            sendResponse(res, 400, false, 'Email and OTP are required');
            return;
        }

        const Model = getModelByRole(role);
        const user = await (Model as any).findOne({ email, otpCode: otp });

        if (!user || user.otpExpiry! < new Date()) {
            sendResponse(res, 400, false, 'Invalid or expired OTP');
            return;
        }

        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpiry = undefined;
        await user.save();

        sendResponse(res, 200, true, 'Account verified successfully.');
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, role } = req.body;

        let user: any = null;
        let selectedRole = role;

        // If role is provided, try that first
        if (selectedRole) {
            const Model = getModelByRole(selectedRole);
            user = await (Model as any).findOne({ email });
        }

        // If not found (or role wasn't provided), try all collections
        if (!user) {
            const models = [
                { role: 'user', Model: User },
                { role: 'admin', Model: Admin },
                { role: 'helper', Model: Helper }
            ];

            for (const m of models) {
                user = await (m.Model as any).findOne({ email });
                if (user) {
                    selectedRole = m.role;
                    break;
                }
            }
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            sendResponse(res, 400, false, 'Invalid credentials');
            return;
        }

        if (!user.isVerified) {
            sendResponse(res, 400, false, 'Please verify your email before logging in');
            return;
        }

        // Ensure user object has correct role for the payload
        const userRole = user.role || selectedRole;

        const payload = { id: user._id, role: userRole };
        const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

        sendResponse(res, 200, true, 'Login successful', {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: userRole }
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const Model = getModelByRole(role!);

        const user = await (Model as any).findById(userId).select('-password -otpCode -verificationToken');
        if (!user) {
            sendResponse(res, 404, false, 'User not found');
            return;
        }

        // Always inject role from JWT into response (Helper model doesn't have a role field)
        const userData = user.toObject ? user.toObject() : user;
        sendResponse(res, 200, true, 'User profile fetched', { ...userData, role });
    } catch (error) {
        next(error);
    }
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false }, (err: any, user: any) => {
        if (err || !user) {
            return res.redirect(`${env.frontendUrl}/login?error=auth_failed`);
        }
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
        res.redirect(`${env.frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage
        }))}`);
    })(req, res, next);
};

export const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('github', { session: false }, (err: any, user: any) => {
        if (err || !user) {
            console.error('GitHub Strategy Error or No User:', err);
            return res.redirect(`${env.frontendUrl}/login?error=auth_failed`);
        }
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
        res.redirect(`${env.frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage
        }))}`);
    })(req, res, next);
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, role = 'user' } = req.body;
        const Model = getModelByRole(role);

        const user = await (Model as any).findOne({ email });
        if (!user) {
            return sendResponse(res, 404, false, 'User with this email does not exist');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();

        await sendResetPasswordEmail(email, resetToken);

        sendResponse(res, 200, true, 'Password reset link sent to your email');
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, newPassword, role = 'user' } = req.body;
        const Model = getModelByRole(role);

        const user = await (Model as any).findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return sendResponse(res, 400, false, 'Reset link expired or invalid');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        sendResponse(res, 200, true, 'Password reset successful. You can now login.');
    } catch (error) {
        next(error);
    }
};
