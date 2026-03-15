import { Router } from 'express';
import { getChallenges, getTodayChallenge, getChallenge, createChallenge, updateChallenge, deleteChallenge, submitChallenge, getUserSubmissions, getCodingStats } from '../controllers/challenge.controller';
import { explainCode } from '../controllers/ai.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/roleGuard';

const router = Router();

router.get('/', getChallenges);
router.get('/today', getTodayChallenge);
router.get('/submissions', auth, getUserSubmissions);
router.get('/:id', getChallenge);
router.post('/', auth, adminOnly, createChallenge);
router.put('/:id', auth, adminOnly, updateChallenge);
router.delete('/:id', auth, deleteChallenge);
router.post('/:id/submit', auth, submitChallenge);
router.post('/ai/explain', auth, explainCode);
router.get('/user/stats', auth, getCodingStats);

export default router;
