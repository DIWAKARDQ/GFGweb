import { Router } from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, getEventRegistrations, getUserEvents } from '../controllers/event.controller';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/roleGuard';

const router = Router();

router.get('/', getEvents);
router.get('/my', auth, getUserEvents);
router.get('/:id', getEvent);
router.post('/', auth, adminOnly, createEvent);
router.put('/:id', auth, adminOnly, updateEvent);
router.delete('/:id', auth, adminOnly, deleteEvent);
router.post('/:id/register', auth, registerForEvent);
router.get('/:id/registrations', auth, adminOnly, getEventRegistrations);

export default router;
