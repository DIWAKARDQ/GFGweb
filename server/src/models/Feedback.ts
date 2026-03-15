import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  rating: number;
  category: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  category: { type: String, default: 'general' },
}, { timestamps: true });

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);
