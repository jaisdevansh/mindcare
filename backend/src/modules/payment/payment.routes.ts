import { Router } from 'express';
import { createOrder, verifyPayment } from './payment.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);

export default router;
