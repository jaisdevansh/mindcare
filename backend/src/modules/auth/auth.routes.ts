import { Router } from 'express';
import { register, login, getMe, verifyEmail, verifyOtp, googleAuth, googleCallback, githubAuth, githubCallback, forgotPassword, resetPassword } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit verification attempts
const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many verification attempts, please try again later.'
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/verify-email', verifyLimiter, verifyEmail);
router.post('/verify-otp', verifyLimiter, verifyOtp);

// Social Auth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
