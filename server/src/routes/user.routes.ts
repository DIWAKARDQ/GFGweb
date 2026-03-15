import { Router } from 'express';
import { getUser, updateUser, getAllUsers, deleteUser, getStats } from '../controllers/user.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/roleGuard';

const router = Router();

router.get('/stats', auth, adminOnly, getStats);
router.get('/', auth, adminOnly, getAllUsers);
router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, adminOnly, deleteUser);

export default router;
