import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
    getQuestions,
    submitAssignment,
    getAssignmentHistory,
    getEmotionLogs,
    getLatestResult,
    startDynamicAssessment,
    getNextQuestion,
    submitDynamicAssessment,
} from './assignment.controller';

const router = Router();

router.get('/questions', authenticate, getQuestions);

// Extended timeout for AI-heavy route (120 seconds)
router.post('/submit', authenticate, (req, res, next) => {
    res.setTimeout(120000);
    next();
}, submitAssignment);

// Dynamic Assessment Routes
router.post('/dynamic/start', authenticate, startDynamicAssessment);
router.post('/dynamic/next', authenticate, getNextQuestion);
router.post('/dynamic/submit', authenticate, (req, res, next) => {
    res.setTimeout(120000);
    next();
}, submitDynamicAssessment);

router.get('/history', authenticate, getAssignmentHistory);
router.get('/emotion-logs', authenticate, getEmotionLogs);
router.get('/latest', authenticate, getLatestResult);

export default router;
