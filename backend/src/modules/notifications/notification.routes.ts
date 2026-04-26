import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { getNotifications, markRead, markAllRead, deleteNotification } from './notification.controller';

const router = Router();

router.use(authenticate);

router.get('/',                    getNotifications);
router.patch('/read-all',          markAllRead);
router.patch('/:id/read',          markRead);
router.delete('/:id',              deleteNotification);

export default router;
