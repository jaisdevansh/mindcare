import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
    getQuestions,
    submitAssignment,
    getAssignmentHistory,
    getEmotionLogs,
    getLatestResult,
} from './assignment.controller';

const router = Router();

router.get('/questions', authenticate, getQuestions);

// Extended timeout for AI-heavy route (120 seconds)
router.post('/submit', authenticate, (req, res, next) => {
    res.setTimeout(120000);
    next();
}, submitAssignment);

router.get('/history', authenticate, getAssignmentHistory);
router.get('/emotion-logs', authenticate, getEmotionLogs);
router.get('/latest', authenticate, getLatestResult);

export default router;
