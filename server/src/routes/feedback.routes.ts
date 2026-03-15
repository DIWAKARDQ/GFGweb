import { Router } from 'express';
import { submitFeedback, getAllFeedback, getFeedbackStats, deleteFeedback } from '../controllers/feedback.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/roleGuard';

const router = Router();

router.post('/', auth, submitFeedback);
router.get('/', auth, adminOnly, getAllFeedback);
router.get('/stats', auth, adminOnly, getFeedbackStats);
router.delete('/:id', auth, adminOnly, deleteFeedback);

export default router;
