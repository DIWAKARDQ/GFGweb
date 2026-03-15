import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, bio, avatar, language, theme, notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, avatar, language, theme, notifications },
      { new: true }
    ).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 'streak.lastActive': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    const admins = await User.countDocuments({ role: 'admin' });
    res.json({ totalUsers, activeUsers, admins });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
