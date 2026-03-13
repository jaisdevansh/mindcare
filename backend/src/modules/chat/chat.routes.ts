import { Router } from 'express';
import { createSession, getSessions } from './chat.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/sessions', authenticate, createSession);
router.get('/sessions', authenticate, getSessions);

export default router;
