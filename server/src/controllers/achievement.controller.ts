import { Response } from 'express';
import Achievement from '../models/Achievement';
import UserAchievement from '../models/UserAchievement';
import { AuthRequest } from '../middleware/auth';

export const getAchievements = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user._id;
    const userAchievements = await UserAchievement.find({ userId }).populate('achievementId');
    res.json(userAchievements);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const awardAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, achievementId } = req.body;
    const existing = await UserAchievement.findOne({ userId, achievementId });
    if (existing) { res.status(400).json({ message: 'Achievement already awarded' }); return; }
    const ua = await UserAchievement.create({ userId, achievementId });
    res.status(201).json(ua);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    await UserAchievement.deleteMany({ achievementId: req.params.id });
    res.json({ message: 'Achievement deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
