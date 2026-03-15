import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any });
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) { res.status(400).json({ message: 'User already exists' }); return; }

    const user = new User({ name, email, password, role: role || 'student' });
    await user.save();
    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(400).json({ message: 'Invalid credentials' }); return; }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) { res.status(400).json({ message: 'Invalid credentials' }); return; }

    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(req.user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const googleLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential) { res.status(400).json({ message: 'Google credential is required' }); return; }

    // Verify the Google ID token via Google's tokeninfo endpoint
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!verifyRes.ok) { res.status(401).json({ message: 'Invalid Google token' }); return; }

    const payload: any = await verifyRes.json();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) { res.status(400).json({ message: 'Email not available from Google account' }); return; }

    // Find existing user by email or create new one
    let user = await User.findOne({ email });
    if (user) {
      // Link Google data if not already linked
      if (!user.avatar && picture) { user.avatar = picture; await user.save(); }
    } else {
      // Auto-create new student account
      user = new User({
        name: name || email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-16) + '!' + Date.now(),
        avatar: picture || '',
        role: 'student',
      });
      await user.save();
    }

    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar || picture || '' } });
  } catch (error: any) {
    res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
};

export const githubAuth = async (req: AuthRequest, res: Response): Promise<void> => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user,repo`;
  res.json({ url });
};

export const githubCallback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
    });
    const tokenData: any = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Get GitHub user data
    const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${accessToken}` } });
    const githubUser: any = await userRes.json();

    // Find or create user
    let user = await User.findOne({ githubId: String(githubUser.id) });
    if (!user) {
      user = await User.findOne({ email: githubUser.email });
      if (user) {
        user.githubId = String(githubUser.id);
        user.githubUsername = githubUser.login;
        user.githubData = { avatarUrl: githubUser.avatar_url, repos: githubUser.public_repos, followers: githubUser.followers, following: githubUser.following, contributions: 0, languages: [], topRepos: [] };
        await user.save();
      } else {
        user = new User({
          name: githubUser.name || githubUser.login,
          email: githubUser.email || `${githubUser.login}@github.com`,
          password: Math.random().toString(36).slice(-12),
          githubId: String(githubUser.id),
          githubUsername: githubUser.login,
          avatar: githubUser.avatar_url,
          githubData: { avatarUrl: githubUser.avatar_url, repos: githubUser.public_repos, followers: githubUser.followers, following: githubUser.following, contributions: 0, languages: [], topRepos: [] },
        });
        await user.save();
      }
    }

    const token = generateToken(user._id.toString());
    const clientUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  } catch (error: any) {
    res.status(500).json({ message: 'GitHub auth failed', error: error.message });
  }
};
