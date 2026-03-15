'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Flame, Github, Code } from 'lucide-react';
import { api } from '@/lib/api';

const filters = ['all-time', 'monthly', 'weekly'];

const fallbackLeaderboard = [
  { rank: 1, name: 'Karthik Sundaramoorthy', challengePoints: 450, githubPoints: 200, eventPoints: 150, totalPoints: 800, streak: 42 },
  { rank: 2, name: 'Divya Lakshmi', challengePoints: 420, githubPoints: 180, eventPoints: 180, totalPoints: 780, streak: 38 },
  { rank: 3, name: 'Aravind Krishnan', challengePoints: 380, githubPoints: 220, eventPoints: 120, totalPoints: 720, streak: 35 },
  { rank: 4, name: 'Meenakshi Rajan', challengePoints: 350, githubPoints: 190, eventPoints: 140, totalPoints: 680, streak: 28 },
  { rank: 5, name: 'Suriya Prakash', challengePoints: 330, githubPoints: 170, eventPoints: 160, totalPoints: 660, streak: 25 },
  { rank: 6, name: 'Preethi Narayanan', challengePoints: 310, githubPoints: 160, eventPoints: 130, totalPoints: 600, streak: 22 },
  { rank: 7, name: 'Harish Kumar', challengePoints: 290, githubPoints: 150, eventPoints: 110, totalPoints: 550, streak: 19 },
  { rank: 8, name: 'Kavitha Senthilkumar', challengePoints: 270, githubPoints: 140, eventPoints: 100, totalPoints: 510, streak: 16 },
  { rank: 9, name: 'Bala Murugan', challengePoints: 250, githubPoints: 130, eventPoints: 90, totalPoints: 470, streak: 14 },
  { rank: 10, name: 'Swetha Ramachandran', challengePoints: 230, githubPoints: 120, eventPoints: 80, totalPoints: 430, streak: 12 },
];

const rankIcons = [<Crown key={0} className="text-amber-400" size={20} />, <Medal key={1} className="text-gray-300" size={20} />, <Medal key={2} className="text-amber-600" size={20} />];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('all-time');
  const [leaderboard, setLeaderboard] = useState(fallbackLeaderboard);

  useEffect(() => {
    api.getLeaderboard(filter).then((data: any) => {
      if (Array.isArray(data) && data.length > 0) {
        setLeaderboard(data.map((entry: any, i: number) => ({
          rank: i + 1,
          name: entry.userId?.name || entry.name || `User ${i + 1}`,
          challengePoints: entry.challengePoints || 0,
          githubPoints: entry.githubPoints || 0,
          eventPoints: entry.eventPoints || 0,
          totalPoints: entry.totalPoints || 0,
          streak: entry.userId?.streak?.current || 0,
        })));
      }
    }).catch(() => {});
  }, [filter]);

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-400 mb-8">Top performers in the GFG RIT community</p>

          <div className="flex gap-2 mb-8">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' : 'glass text-gray-400 hover:text-white'}`}>
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Top 3 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 0, 2].map((order, i) => {
              const u = leaderboard[order];
              if (!u) return null;
              const isFirst = order === 0;
              return (
                <motion.div key={u.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`glass rounded-2xl p-6 text-center card-hover ${isFirst ? 'ring-2 ring-amber-400/30' : ''}`}>
                  <div className="mb-3">{rankIcons[order]}</div>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${order === 0 ? 'from-amber-400 to-yellow-600' : order === 1 ? 'from-gray-300 to-gray-500' : 'from-amber-600 to-amber-800'} flex items-center justify-center text-white font-bold text-xl mx-auto mb-3`}>
                    {u.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-white text-sm">{u.name}</h3>
                  <div className="text-2xl font-black text-white mt-2">{u.totalPoints}</div>
                  <div className="text-xs text-gray-500">points</div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-orange-400 text-xs">
                    <Flame size={12} /> {u.streak} day streak
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Full Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 p-4 text-xs font-medium text-gray-500 uppercase border-b border-white/5">
              <div className="col-span-1">Rank</div>
              <div className="col-span-3">Student</div>
              <div className="col-span-2 text-center">Challenges</div>
              <div className="col-span-2 text-center">GitHub</div>
              <div className="col-span-2 text-center">Events</div>
              <div className="col-span-2 text-center">Total</div>
            </div>
            {leaderboard.map((user, i) => (
              <motion.div key={user.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 items-center p-4 border-b border-white/5 hover:bg-white/5 transition-all">
                <div className="col-span-1">
                  <span className={`font-bold ${user.rank <= 3 ? 'text-amber-400' : 'text-gray-500'}`}>#{user.rank}</span>
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{user.name}</div>
                    <div className="flex items-center gap-1 text-xs text-orange-400"><Flame size={10} />{user.streak}d</div>
                  </div>
                </div>
                <div className="col-span-2 text-center text-sm text-green-400 font-medium">{user.challengePoints}</div>
                <div className="col-span-2 text-center text-sm text-blue-400 font-medium">{user.githubPoints}</div>
                <div className="col-span-2 text-center text-sm text-purple-400 font-medium">{user.eventPoints}</div>
                <div className="col-span-2 text-center text-lg font-bold text-white">{user.totalPoints}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
