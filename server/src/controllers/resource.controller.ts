import { Response } from 'express';
import Resource from '../models/Resource';
import { AuthRequest } from '../middleware/auth';

export const getResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, type, difficulty } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    const resources = await Resource.find(filter).sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id).populate('createdBy', 'name');
    if (!resource) { res.status(404).json({ message: 'Resource not found' }); return; }
    res.json(resource);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resource = new Resource({ ...req.body, createdBy: req.user._id });
    await resource.save();
    res.status(201).json(resource);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) { res.status(404).json({ message: 'Resource not found' }); return; }
    res.json(resource);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
