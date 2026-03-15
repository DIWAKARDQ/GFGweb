import { Response } from 'express';
import LeaderboardEntry from '../models/LeaderboardEntry';
import { AuthRequest } from '../middleware/auth';

export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filter = 'all-time' } = req.query;
    let period = 'all-time';
    const now = new Date();
    if (filter === 'weekly') {
      const weekNum = Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7);
      period = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    } else if (filter === 'monthly') {
      period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    const entries = await LeaderboardEntry.find({ period })
      .populate('userId', 'name avatar githubUsername streak')
      .sort({ totalPoints: -1 })
      .limit(100);
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, challengePoints, githubPoints, eventPoints, period } = req.body;
    const total = (challengePoints || 0) + (githubPoints || 0) + (eventPoints || 0);
    const entry = await LeaderboardEntry.findOneAndUpdate(
      { userId, period },
      { challengePoints, githubPoints, eventPoints, totalPoints: total },
      { upsert: true, new: true }
    );
    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
