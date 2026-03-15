import { Router } from 'express';
import { getAchievements, createAchievement, getUserAchievements, awardAchievement, deleteAchievement } from '../controllers/achievement.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/roleGuard';

const router = Router();

router.get('/', getAchievements);
router.post('/', auth, adminOnly, createAchievement);
router.get('/user/:userId', auth, getUserAchievements);
router.post('/award', auth, adminOnly, awardAchievement);
router.delete('/:id', auth, adminOnly, deleteAchievement);

export default router;
