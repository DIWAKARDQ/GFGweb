import { Router } from 'express';
import { register, login, getMe, googleLogin, githubAuth, githubCallback, registerValidation, loginValidation } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/google', googleLogin);
router.get('/me', auth, getMe);
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

export default router;
