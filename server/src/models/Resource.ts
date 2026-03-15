import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  category: 'dsa' | 'webdev' | 'aiml' | 'interview';
  type: 'article' | 'roadmap' | 'problem' | 'collection';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const resourceSchema = new Schema<IResource>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['dsa', 'webdev', 'aiml', 'interview'], required: true },
  type: { type: String, enum: ['article', 'roadmap', 'problem', 'collection'], default: 'article' },
  url: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  tags: [String],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<IResource>('Resource', resourceSchema);
