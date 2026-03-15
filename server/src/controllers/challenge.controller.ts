import { Response } from 'express';
import Challenge from '../models/Challenge';
import ChallengeSubmission from '../models/ChallengeSubmission';
import User from '../models/User';
import LeaderboardEntry from '../models/LeaderboardEntry';
import { AuthRequest } from '../middleware/auth';
// Language mappings for Piston API
const PISTON_LANGUAGES: Record<string, { language: string, version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
};

export const getChallenges = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challenges = await Challenge.find({ isActive: true }).select('-testCases.expectedOutput').sort({ date: -1 });
    res.json(challenges);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTodayChallenge = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    let challenge = await Challenge.findOne({ date: { $gte: today, $lt: tomorrow }, isActive: true }).select('-testCases.expectedOutput');
    if (!challenge) challenge = await Challenge.findOne({ isActive: true }).select('-testCases.expectedOutput').sort({ date: -1 });
    res.json(challenge);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Only return non-hidden test cases to the client, and hide expected output
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) { res.status(404).json({ message: 'Challenge not found' }); return; }
    
    // Create a safe copy for the client
    const safeChallenge = challenge.toObject();
    safeChallenge.testCases = safeChallenge.testCases.filter(tc => !tc.isHidden).map(tc => ({ ...tc, expectedOutput: 'hidden' }));
    
    res.json(safeChallenge);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') { res.status(403).json({ message: 'Admin only' }); return; }
    
    const challenge = new Challenge({ ...req.body, createdBy: req.user._id });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'admin') { res.status(403).json({ message: 'Admin only' }); return; }
    
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!challenge) { res.status(404).json({ message: 'Challenge not found' }); return; }
    res.json(challenge);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'admin') { res.status(403).json({ message: 'Admin only' }); return; }
    
    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Challenge deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const submitChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { language, code } = req.body;
    if (!language || !code) { res.status(400).json({ message: 'Language and code are required' }); return; }

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) { res.status(404).json({ message: 'Challenge not found' }); return; }

    // Check if the user already solved this challenge to prevent duplicate points
    const existingSubmission = await ChallengeSubmission.findOne({
      userId: req.user._id,
      challengeId: challenge._id,
      result: 'passed'
    });

    if (!PISTON_LANGUAGES[language]) { res.status(400).json({ message: 'Unsupported language' }); return; }

    let passedCount = 0;
    const totalCases = challenge.testCases.length;
    let fullOutput = '';
    let hasError = false;

    // Fast-path: if no test cases, just run the code once
    if (totalCases === 0) {
      const execRes = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: PISTON_LANGUAGES[language].language,
          version: PISTON_LANGUAGES[language].version,
          files: [{ content: code }]
        })
      });
      const data: any = await execRes.json();
      fullOutput = data.run?.output || data.message || 'Execution failed';
      hasError = data.run?.code !== 0;
    } else {
      // Run against all test cases
      for (let i = 0; i < totalCases; i++) {
        const tc = challenge.testCases[i];
        const execRes = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: PISTON_LANGUAGES[language].language,
            version: PISTON_LANGUAGES[language].version,
            files: [{ content: code }],
            stdin: tc.input
          })
        });
        
        const data: any = await execRes.json();
        const actualOutput = (data.run?.stdout || '').trim();
        const errorOutput = (data.run?.stderr || '').trim();
        const expectedOutput = tc.expectedOutput.trim();

        if (data.run?.code !== 0 || errorOutput) {
          hasError = true;
          fullOutput += `Test Case ${i+1}:\nError:\n${errorOutput || data.run?.output}\n\n`;
        } else if (actualOutput === expectedOutput) {
          passedCount++;
          fullOutput += `Test Case ${i+1}: Passed\n`;
        } else {
          fullOutput += `Test Case ${i+1}: Failed\nExpected:\n${expectedOutput}\nGot:\n${actualOutput}\n\n`;
        }
      }
    }

    const isSuccess = totalCases === 0 ? !hasError : passedCount === totalCases;
    const finalResult = hasError ? 'error' : isSuccess ? 'passed' : 'failed';

    // Save submission
    const submission = await ChallengeSubmission.create({
      userId: req.user._id,
      challengeId: challenge._id,
      language,
      code,
      result: finalResult,
      testCasesPassed: passedCount,
      totalTestCases: totalCases,
      executionOutput: fullOutput,
      executionTime: 0 // Could extract from Piston if needed
    });

    // Update streak if completely successful
    if (isSuccess) {
      // Check if this challenge was already solved today to prevent double-counting streak
      const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);
      
      const alreadySolvedToday = await ChallengeSubmission.findOne({
        userId: req.user._id,
        challengeId: challenge._id,
        result: 'passed',
        completedAt: { $gte: startOfDay, $lt: endOfDay },
        _id: { $ne: submission._id }
      });

      if (!alreadySolvedToday) {
        const user = await User.findById(req.user._id);
        if (user) {
          const lastActive = new Date(user.streak.lastActive);
          const now = new Date();
          const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 1) {
            user.streak.current += 1;
            if (user.streak.current > user.streak.longest) user.streak.longest = user.streak.current;
          } else if (diffDays > 1) {
            // Missed a day, reset streak
            user.streak.current = 1;
          }
          user.streak.lastActive = now;
          await user.save();
        }
      }
    }

    res.status(201).json({ 
      message: isSuccess ? 'All test cases passed!' : 'Some test cases failed.',
      result: finalResult,
      testCasesPassed: passedCount,
      totalTestCases: totalCases,
      output: fullOutput
    });

    if (passedCount === totalCases && totalCases > 0) {
      if (!existingSubmission) {
        // Award points based on difficulty if this is their first time passing
        const pointsAwarded = challenge.difficulty === 'hard' ? 30 : challenge.difficulty === 'medium' ? 20 : 10;
        
        // Update all-time leaderboard
        await LeaderboardEntry.findOneAndUpdate(
          { userId: req.user._id, period: 'all-time' },
          { $inc: { challengePoints: pointsAwarded, totalPoints: pointsAwarded } },
          { upsert: true }
        );

        // Update monthly leaderboard
        const now = new Date();
        const monthlyPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        await LeaderboardEntry.findOneAndUpdate(
          { userId: req.user._id, period: monthlyPeriod },
          { $inc: { challengePoints: pointsAwarded, totalPoints: pointsAwarded } },
          { upsert: true }
        );
        
        // Update weekly leaderboard
        const weekNum = Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7);
        const weeklyPeriod = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
        await LeaderboardEntry.findOneAndUpdate(
          { userId: req.user._id, period: weeklyPeriod },
          { $inc: { challengePoints: pointsAwarded, totalPoints: pointsAwarded } },
          { upsert: true }
        );
      }
    }

  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getUserSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await ChallengeSubmission.find({ userId: req.user._id }).populate('challengeId').sort({ completedAt: -1 });
    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCodingStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get user stats for dashboard
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    // Aggregate submissions
    const submissions = await ChallengeSubmission.find({ userId: req.user._id }).populate('challengeId', 'difficulty');
    
    const passedSubmissions = submissions.filter(s => s.result === 'passed');
    
    // Calculate difficulty distribution for passed challenges
    const difficultyDistribution = { easy: 0, medium: 0, hard: 0 };
    
    // Use a Set to avoid counting the same challenge twice
    const uniqueSolvedChallenges = new Set();
    
    passedSubmissions.forEach(sub => {
      if (sub.challengeId && !uniqueSolvedChallenges.has(sub.challengeId._id.toString())) {
        uniqueSolvedChallenges.add(sub.challengeId._id.toString());
        const diff = (sub.challengeId as any).difficulty as 'easy' | 'medium' | 'hard';
        if (diff) difficultyDistribution[diff]++;
      }
    });

    const accuracy = submissions.length > 0 
      ? Math.round((passedSubmissions.length / submissions.length) * 100) 
      : 0;

    // Generate recent activity for heatmap (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await ChallengeSubmission.aggregate([
      { 
        $match: { 
          userId: user._id,
          completedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      streak: user.streak,
      totalSolved: uniqueSolvedChallenges.size,
      accuracy,
      difficultyDistribution,
      recentActivity,
      recentSubmissions: submissions.slice(0, 5) // Return 5 most recent
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
