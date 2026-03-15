import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: mongoose.Types.ObjectId;
  awardedAt: Date;
}

const userAchievementSchema = new Schema<IUserAchievement>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: Schema.Types.ObjectId, ref: 'Achievement', required: true },
  awardedAt: { type: Date, default: Date.now },
});

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.model<IUserAchievement>('UserAchievement', userAchievementSchema);
