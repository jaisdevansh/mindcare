import { Router } from 'express';
import { processChat, moodDetectEndpoint, depressionCheckEndpoint, getMoodHistory, getDashboardStats, getAIChatHistory } from './ai.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.post('/chat', authenticate, processChat);
router.post('/mood-detect', authenticate, moodDetectEndpoint);
router.post('/depression-check', authenticate, depressionCheckEndpoint);
router.get('/history', authenticate, getMoodHistory);
router.get('/stats', authenticate, getDashboardStats);

router.get('/chat-history', authenticate, getAIChatHistory);

export default router;
