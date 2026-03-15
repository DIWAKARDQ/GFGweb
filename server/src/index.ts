import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Route imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';
import challengeRoutes from './routes/challenge.routes';
import resourceRoutes from './routes/resource.routes';
import achievementRoutes from './routes/achievement.routes';
import feedbackRoutes from './routes/feedback.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import aiRoutes from './routes/ai.routes';
import githubRoutes from './routes/github.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests, please try again later.' });
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/github', githubRoutes);

// Health check
app.get('/api/health', (_req, res) => { res.json({ status: 'OK', timestamp: new Date().toISOString() }); });

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`); });
};

startServer().catch(console.error);

export default app;
