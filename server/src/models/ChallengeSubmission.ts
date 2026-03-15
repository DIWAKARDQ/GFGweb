import mongoose, { Document, Schema } from 'mongoose';

export interface IChallengeSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  language: string;
  code: string;
  result: 'passed' | 'failed' | 'error';
  testCasesPassed: number;
  totalTestCases: number;
  executionOutput: string;
  executionTime: number;
  completedAt: Date;
}

const challengeSubmissionSchema = new Schema<IChallengeSubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  result: { type: String, enum: ['passed', 'failed', 'error'], required: true },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  executionOutput: { type: String, default: '' },
  executionTime: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
});

challengeSubmissionSchema.index({ userId: 1, challengeId: 1 });

export default mongoose.model<IChallengeSubmission>('ChallengeSubmission', challengeSubmissionSchema);
