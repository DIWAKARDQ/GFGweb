import { Response } from 'express';
import Event from '../models/Event';
import EventRegistration from '../models/EventRegistration';
import LeaderboardEntry from '../models/LeaderboardEntry';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 }).populate('createdBy', 'name');
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) { res.status(404).json({ message: 'Event not found' }); return; }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user._id });
    await event.save();
    res.status(201).json(event);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) { res.status(404).json({ message: 'Event not found' }); return; }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    await EventRegistration.deleteMany({ eventId: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) { res.status(404).json({ message: 'Event not found' }); return; }

    // Check if user already registered
    const existing = await EventRegistration.findOne({ userId: req.user._id, eventId: req.params.id });
    if (existing) { res.status(400).json({ message: 'Already registered for this event' }); return; }

    const { registrationType, participant, team } = req.body;

    // Determine registration type based on event type
    const isTeamEvent = event.type === 'hackathon' || event.type === 'competition';
    const regType = isTeamEvent ? 'team' : 'individual';

    // For team events, count team size toward capacity
    let slotsNeeded = 1;
    if (regType === 'team' && team) {
      slotsNeeded = 1 + (team.members?.length || 0); // leader + members
    }

    if (event.registeredCount + slotsNeeded > event.capacity) {
      res.status(400).json({ message: 'Not enough capacity for this registration' }); return;
    }

    // Validate required fields
    if (regType === 'individual') {
      if (!participant || !participant.fullName || !participant.mobile || !participant.department || !participant.year) {
        res.status(400).json({ message: 'Full Name, Mobile, Department, and Year are required' }); return;
      }
    } else {
      if (!team || !team.teamName || !team.leader) {
        res.status(400).json({ message: 'Team Name and Leader details are required' }); return;
      }
      if (!team.leader.fullName || !team.leader.mobile || !team.leader.department || !team.leader.year) {
        res.status(400).json({ message: 'Leader Full Name, Mobile, Department, and Year are required' }); return;
      }
    }

    const registration = await EventRegistration.create({
      userId: req.user._id,
      eventId: req.params.id,
      registrationType: regType,
      participant: regType === 'individual' ? participant : undefined,
      team: regType === 'team' ? team : undefined,
    });

    event.registeredCount += slotsNeeded;
    await event.save();

    // Award Event Points (20 points per event)
    const pointsAwarded = 20;

    // Update all-time leaderboard
    await LeaderboardEntry.findOneAndUpdate(
      { userId: req.user._id, period: 'all-time' },
      { $inc: { eventPoints: pointsAwarded, totalPoints: pointsAwarded } },
      { upsert: true }
    );

    // Update monthly leaderboard
    const now = new Date();
    const monthlyPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    await LeaderboardEntry.findOneAndUpdate(
      { userId: req.user._id, period: monthlyPeriod },
      { $inc: { eventPoints: pointsAwarded, totalPoints: pointsAwarded } },
      { upsert: true }
    );

    // Update weekly leaderboard
    const weekNum = Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7);
    const weeklyPeriod = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    await LeaderboardEntry.findOneAndUpdate(
      { userId: req.user._id, period: weeklyPeriod },
      { $inc: { eventPoints: pointsAwarded, totalPoints: pointsAwarded } },
      { upsert: true }
    );

    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEventRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id })
      .populate('userId', 'name email avatar')
      .sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const registrations = await EventRegistration.find({ userId: req.user._id }).populate('eventId');
    const events = registrations.map(r => r.eventId);
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
