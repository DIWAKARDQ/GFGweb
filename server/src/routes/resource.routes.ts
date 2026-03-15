import { Router } from 'express';
import { getResources, getResource, createResource, updateResource, deleteResource } from '../controllers/resource.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/roleGuard';

const router = Router();

router.get('/', getResources);
router.get('/:id', getResource);
router.post('/', auth, adminOnly, createResource);
router.put('/:id', auth, adminOnly, updateResource);
router.delete('/:id', auth, adminOnly, deleteResource);

export default router;
