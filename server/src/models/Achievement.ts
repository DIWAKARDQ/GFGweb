import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  name: string;
  description: string;
  icon: string;
  criteria: string;
  category: 'streak' | 'hackathon' | 'event' | 'github' | 'challenge';
  threshold: number;
}

const achievementSchema = new Schema<IAchievement>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  criteria: { type: String, required: true },
  category: { type: String, enum: ['streak', 'hackathon', 'event', 'github', 'challenge'], required: true },
  threshold: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model<IAchievement>('Achievement', achievementSchema);
