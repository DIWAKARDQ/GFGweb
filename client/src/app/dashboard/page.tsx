'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy, Github, Star, Code, TrendingUp, Award, BookOpen, Zap, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const stats = [
  { icon: <Flame className="text-orange-400" size={24} />, label: 'Current Streak', value: '12 days', color: 'from-orange-500/20 to-red-500/20' },
  { icon: <Code className="text-green-400" size={24} />, label: 'Challenges Solved', value: '47', color: 'from-green-500/20 to-emerald-500/20' },
  { icon: <Calendar className="text-blue-400" size={24} />, label: 'Events Attended', value: '8', color: 'from-blue-500/20 to-cyan-500/20' },
  { icon: <Trophy className="text-amber-400" size={24} />, label: 'Leaderboard Rank', value: '#15', color: 'from-amber-500/20 to-yellow-500/20' },
];

const achievements = [
  { icon: '🔥', name: '7-Day Streak', desc: 'Coded for 7 consecutive days', earned: true },
  { icon: '⚡', name: '30-Day Consistency', desc: '30 days of active coding', earned: true },
  { icon: '🏆', name: 'Hackathon Winner', desc: 'Won a club hackathon', earned: false },
  { icon: '🌟', name: 'Top 10 Monthly', desc: 'Reached top 10 on leaderboard', earned: false },
  { icon: '🐙', name: 'GitHub Star', desc: '50+ GitHub contributions', earned: true },
  { icon: '📚', name: 'Knowledge Seeker', desc: 'Completed 10+ resources', earned: false },
];

const registeredEvents: { title: string; date: string; type: string }[] = [];

const githubData = {
  username: 'karthik_dev',
  repos: 25,
  followers: 42,
  contributions: 367,
  languages: ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'],
  topRepos: [
    { name: 'react-portfolio', stars: 15, url: '#' },
    { name: 'dsa-solutions', stars: 23, url: '#' },
    { name: 'ml-project', stars: 8, url: '#' },
  ],
};

// Generate contribution graph data
const contributionWeeks = Array.from({ length: 20 }, () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
);

const contribColors = ['bg-gray-800', 'bg-green-900', 'bg-green-700', 'bg-green-500', 'bg-green-400'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [codingStats, setCodingStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      if (user) {
        const stats = await api.getCodingStats();
        setCodingStats(stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-grid py-20 text-center">
        <Loader2 className="animate-spin text-green-500 mx-auto mb-4" size={48} />
        <p className="text-gray-400">Loading your coding journey...</p>
      </div>
    );
  }

  const currentStreak = codingStats?.streak?.current || user?.streak?.current || 0;
  const longestStreak = codingStats?.streak?.longest || user?.streak?.longest || 0;
  const problemsSolved = codingStats?.totalSolved || 0;
  const accuracy = codingStats?.accuracy || 0;
  
  const stats = [
    { icon: <Flame className="text-orange-400" size={24} />, label: 'Current Streak', value: `${currentStreak} days`, color: 'from-orange-500/20 to-red-500/20' },
    { icon: <Code className="text-green-400" size={24} />, label: 'Challenges Solved', value: `${problemsSolved}`, color: 'from-green-500/20 to-emerald-500/20' },
    { icon: <Zap className="text-amber-400" size={24} />, label: 'Accuracy', value: `${accuracy}%`, color: 'from-amber-500/20 to-yellow-500/20' },
    { icon: <Trophy className="text-purple-400" size={24} />, label: 'Longest Streak', value: `${longestStreak} days`, color: 'from-purple-500/20 to-violet-500/20' },
  ];

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
          <motion.div variants={fadeIn} className="mb-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Coder'}!</h1>
              <p className="text-gray-400">Here&apos;s your coding journey overview.</p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="glass rounded-2xl p-5 card-hover">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* GitHub Contribution Graph */}
              <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-white" />
                  <h3 className="text-lg font-semibold text-white">Coding Activity Heatmap</h3>
                  <span className="text-sm text-gray-500 ml-auto bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Last 20 Weeks</span>
                </div>
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                  <div className="flex gap-1.5 min-w-[700px]">
                    {contributionWeeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1.5">
                        {week.map((level, di) => (
                          <div 
                            key={di} 
                            className={`w-[14px] h-[14px] rounded-[3px] ${contribColors[level]} transition-all duration-300 hover:scale-125 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/40 cursor-pointer`} 
                            title={level > 0 ? `${level * 2} lines of code` : 'No activity'} 
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5"><Code size={14} className="text-green-400"/> {githubData.contributions} total lines</div>
                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-400"/> 45 active days</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    Less <div className="flex gap-1">{contribColors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}</div> More
                  </div>
                </div>
              </motion.div>

              {/* GitHub Stats */}
              <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏅 Top Repositories</h3>
                <div className="space-y-3">
                  {githubData.topRepos.map(repo => (
                    <div key={repo.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <Code size={16} className="text-green-400" />
                        <span className="font-medium text-white">{repo.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <Star size={14} /> {repo.stars}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm text-gray-400 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {githubData.languages.map(lang => (
                      <span key={lang} className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">{lang}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Difficulty Distribution & Progress */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">🧩 Difficulty Solved</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Easy', count: codingStats?.difficultyDistribution?.easy || 0, color: 'from-green-500 to-emerald-400' },
                      { label: 'Medium', count: codingStats?.difficultyDistribution?.medium || 0, color: 'from-amber-400 to-orange-400' },
                      { label: 'Hard', count: codingStats?.difficultyDistribution?.hard || 0, color: 'from-red-400 to-pink-500' }
                    ].map(d => (
                      <div key={d.label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">{d.label}</span>
                          <span className="font-medium text-white">{d.count}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${d.color} rounded-full transition-all duration-1000`} style={{ width: `${problemsSolved > 0 ? (d.count / problemsSolved) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Focus/Activity Heatmap */}
                <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">📅 Recent Activity</h3>
                  {codingStats?.recentActivity?.length > 0 ? (
                    <div className="space-y-3">
                      {codingStats.recentActivity.map((act: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${act.result === 'passed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              <Code size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white line-clamp-1">{act.challengeTitle}</div>
                              <div className="text-xs text-gray-500">{new Date(act.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${act.result === 'passed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {act.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      <Code className="mx-auto mb-2 opacity-50" />
                      No recent challenge activity. 
                      <a href="/challenges" className="block text-green-400 mt-2">Solve one now!</a>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏆 Achievements</h3>
                <div className="space-y-3">
                  {achievements.map(a => (
                    <div key={a.name} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${a.earned ? 'bg-white/5' : 'bg-white/[0.02] opacity-50'}`}>
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <div className={`text-sm font-medium ${a.earned ? 'text-white' : 'text-gray-500'}`}>{a.name}</div>
                        <div className="text-xs text-gray-500">{a.desc}</div>
                      </div>
                      {a.earned && <Award size={14} className="text-green-400 ml-auto" />}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📅 Registered Events</h3>
                {registeredEvents.length > 0 ? (
                  <div className="space-y-3">
                    {registeredEvents.map(e => (
                      <div key={e.title} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><Calendar size={18} className="text-green-400" /></div>
                        <div>
                          <div className="text-sm font-medium text-white">{e.title}</div>
                          <div className="text-xs text-gray-500">{e.date} · {e.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar size={24} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No events registered yet.</p>
                    <a href="/events" className="text-green-400 text-xs hover:text-green-300 mt-1 inline-block">Browse Events →</a>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: <Code size={16} />, label: 'Today\'s Challenge', href: '/challenges' },
                    { icon: <BookOpen size={16} />, label: 'Learning Resources', href: '/resources' },
                    { icon: <Zap size={16} />, label: 'AI Assistant', href: '/ai' },
                    { icon: <TrendingUp size={16} />, label: 'Leaderboard', href: '/leaderboard' },
                  ].map(a => (
                    <a key={a.label} href={a.href}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-gray-300 hover:text-white text-sm">
                      {a.icon} {a.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
