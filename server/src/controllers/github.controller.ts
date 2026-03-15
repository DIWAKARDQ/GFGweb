import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const syncGitHub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.githubUsername) { res.status(400).json({ message: 'GitHub not connected' }); return; }

    // Fetch user data
    const userRes = await fetch(`https://api.github.com/users/${user.githubUsername}`);
    const githubUser: any = await userRes.json();

    // Fetch repos
    const reposRes = await fetch(`https://api.github.com/users/${user.githubUsername}/repos?sort=stars&per_page=5`);
    const repos = await reposRes.json();

    // Get languages from repos
    const languages = new Set<string>();
    const topRepos = (Array.isArray(repos) ? repos : []).map((r: any) => {
      if (r.language) languages.add(r.language);
      return { name: r.name, stars: r.stargazers_count, url: r.html_url };
    });

    user.githubData = {
      avatarUrl: githubUser.avatar_url,
      repos: githubUser.public_repos,
      followers: githubUser.followers,
      following: githubUser.following,
      contributions: 0, // Requires GraphQL API for contribution count
      languages: Array.from(languages),
      topRepos,
    };
    user.avatar = githubUser.avatar_url || user.avatar;
    await user.save();

    res.json({ message: 'GitHub data synced', githubData: user.githubData });
  } catch (error: any) {
    res.status(500).json({ message: 'GitHub sync failed', error: error.message });
  }
};

export const getGitHubStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).select('githubData githubUsername');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(user.githubData);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const connectGitHub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    user.githubUsername = username;
    await user.save();
    res.json({ message: 'GitHub username connected', username });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
