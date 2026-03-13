import { Router } from 'express';
import { getHelperProfile, getAllHelpers } from './helper.controller';
import { applyToBeHelper, getMyApplication } from './helperApplication.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.get('/', getAllHelpers);
router.get('/profile', authenticate, requireRole('helper'), getHelperProfile);
router.post('/apply', authenticate, applyToBeHelper);
router.get('/my-application', authenticate, getMyApplication);

export default router;
