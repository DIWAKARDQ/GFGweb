import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  avatar: string;
  bio: string;
  githubId: string;
  githubUsername: string;
  githubData: {
    avatarUrl: string;
    repos: number;
    followers: number;
    following: number;
    contributions: number;
    languages: string[];
    topRepos: { name: string; stars: number; url: string }[];
  };
  streak: { current: number; longest: number; lastActive: Date };
  language: string;
  theme: string;
  notifications: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  githubId: { type: String, default: '' },
  githubUsername: { type: String, default: '' },
  githubData: {
    avatarUrl: { type: String, default: '' },
    repos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    contributions: { type: Number, default: 0 },
    languages: [String],
    topRepos: [{ name: String, stars: Number, url: String }],
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
  },
  language: { type: String, default: 'en' },
  theme: { type: String, default: 'system' },
  notifications: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
