import mongoose, { Document, Schema } from 'mongoose';

interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface IChallenge extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  date: Date;
  tags: string[];
  link: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: ITestCase[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const testCaseSchema = new Schema<ITestCase>({
  input: { type: String, default: '' },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
}, { _id: false });

const challengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  date: { type: Date, required: true },
  tags: [String],
  link: { type: String, default: '' },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  sampleInput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' },
  testCases: [testCaseSchema],
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<IChallenge>('Challenge', challengeSchema);
