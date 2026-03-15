import { Response } from 'express';
import Feedback from '../models/Feedback';
import { AuthRequest } from '../middleware/auth';

export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const feedback = new Feedback({ ...req.body, userId: req.user._id });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const feedback = await Feedback.find().populate('userId', 'name email avatar').sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFeedbackStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const total = await Feedback.countDocuments();
    const avgRating = await Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]);
    const byCategory = await Feedback.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    res.json({ total, averageRating: avgRating[0]?.avg || 0, byCategory });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
