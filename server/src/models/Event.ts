import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  location: string;
  type: 'workshop' | 'hackathon' | 'seminar' | 'competition' | 'meetup';
  capacity: number;
  registeredCount: number;
  image: string;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String, required: true },
  type: { type: String, enum: ['workshop', 'hackathon', 'seminar', 'competition', 'meetup'], default: 'workshop' },
  capacity: { type: Number, required: true },
  registeredCount: { type: Number, default: 0 },
  image: { type: String, default: '' },
  tags: [String],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', eventSchema);
