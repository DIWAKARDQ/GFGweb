import { Router } from 'express';
import { syncGitHub, getGitHubStats, connectGitHub } from '../controllers/github.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/sync', auth, syncGitHub);
router.get('/stats/:userId', auth, getGitHubStats);
router.post('/connect', auth, connectGitHub);

export default router;
