import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import './config/passport';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import helperRoutes from './modules/helpers/helper.routes';
import adminRoutes from './modules/admins/admin.routes';
import communityRoutes from './modules/community/post.routes';
import chatRoutes from './modules/chat/chat.routes';
import aiRoutes from './modules/ai/ai.routes';
import assignmentRoutes from './modules/assignment/assignment.routes';

import { errorHandler } from './utils/error';

const app = express();

// Disable ETags so API endpoints always return 200 (never 304 Not Modified)
app.set('etag', false);

app.use(express.json());

// ── Serve uploaded files BEFORE helmet so images load cross-origin from frontend ──
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express.static('uploads', { etag: false }));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));
app.use(passport.initialize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

if (process.env.NODE_ENV === 'production') {
    app.use(limiter);
}

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/helpers', helperRoutes);
app.use('/admin', adminRoutes);
app.use('/community', communityRoutes);
app.use('/chat', chatRoutes);
app.use('/ai', aiRoutes);
app.use('/assignment', assignmentRoutes);

app.use(errorHandler);

export default app;
