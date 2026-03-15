import mongoose, { Document, Schema } from 'mongoose';

// Participant details sub-schema
interface IParticipant {
  fullName: string;
  mobile: string;
  department: string;
  year: string;
  githubLink?: string;
  gmail?: string;
}

export interface IEventRegistration extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  registrationType: 'individual' | 'team';
  participant?: IParticipant;
  team?: {
    teamName: string;
    leader: IParticipant;
    members: IParticipant[];
  };
  registeredAt: Date;
}

const participantSchema = new Schema<IParticipant>({
  fullName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  githubLink: { type: String, default: '' },
  gmail: { type: String, default: '' },
}, { _id: false });

const eventRegistrationSchema = new Schema<IEventRegistration>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  registrationType: { type: String, enum: ['individual', 'team'], required: true },
  participant: participantSchema,
  team: {
    teamName: { type: String, trim: true },
    leader: participantSchema,
    members: [participantSchema],
  },
  registeredAt: { type: Date, default: Date.now },
});

eventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export default mongoose.model<IEventRegistration>('EventRegistration', eventRegistrationSchema);
