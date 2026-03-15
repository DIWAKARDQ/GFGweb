import { Router } from 'express';
import { getLeaderboard, updateLeaderboard } from '../controllers/leaderboard.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/roleGuard';

const router = Router();

router.get('/', getLeaderboard);
router.post('/', auth, adminOnly, updateLeaderboard);

export default router;
