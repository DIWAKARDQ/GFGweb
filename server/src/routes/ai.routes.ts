import { Router } from 'express';
import { chat, recommend, explainCode } from '../controllers/ai.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/chat', auth, chat);
router.post('/recommend', auth, recommend);
router.post('/explain', auth, explainCode);

export default router;
