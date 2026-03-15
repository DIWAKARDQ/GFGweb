import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  userId: mongoose.Types.ObjectId;
  challengePoints: number;
  githubPoints: number;
  eventPoints: number;
  totalPoints: number;
  period: string; // e.g., '2024-W03', '2024-01', 'all-time'
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challengePoints: { type: Number, default: 0 },
  githubPoints: { type: Number, default: 0 },
  eventPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  period: { type: String, required: true },
}, { timestamps: true });

leaderboardEntrySchema.index({ userId: 1, period: 1 }, { unique: true });
leaderboardEntrySchema.index({ totalPoints: -1 });

export default mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
