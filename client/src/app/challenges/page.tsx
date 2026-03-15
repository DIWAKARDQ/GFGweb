'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle, Clock, Trophy, Zap, Code } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CodeEditorModal from '@/components/CodeEditorModal';

const diffColors: Record<string, string> = { easy: 'text-green-400 bg-green-500/10', medium: 'text-amber-400 bg-amber-500/10', hard: 'text-red-400 bg-red-500/10' };

export default function ChallengesPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [todayChallenge, setTodayChallenge] = useState<any>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null); // For legacy if needed
  const [streak, setStreak] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<any>(null); // For the modal

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [challengeData, todayData] = await Promise.all([
        api.getChallenges().catch(() => []),
        api.getTodayChallenge().catch(() => null),
      ]);
      setChallenges(Array.isArray(challengeData) ? challengeData : []);
      setTodayChallenge(todayData);

      if (user) {
        try {
          const submissions = await api.getMySubmissions();
          const ids = new Set<string>((Array.isArray(submissions) ? submissions : []).map((s: any) => s.challengeId?._id || s.challengeId));
          setCompleted(ids);
          setStreak(user.streak?.current || ids.size);
        } catch {}
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    if (!user) { alert('Please login to submit challenges'); return; }
    
    // Always open code editor for this challenge
    const c = [...challenges, todayChallenge].find(ch => ch?._id === id);
    if (c) setActiveChallenge(c);
  };

  const handleModalSuccess = () => {
    if (activeChallenge) {
      setCompleted(prev => { const s = new Set(prev); s.add(activeChallenge._id); return s; });
      // Reload stats to get updated streak
      loadData();
    }
  };

  const allChallenges = todayChallenge
    ? [todayChallenge, ...challenges.filter(c => c._id !== todayChallenge._id)]
    : challenges;

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">🔥 Daily Coding Challenges</h1>
          <p className="text-gray-400 mb-8">Solve one problem a day, build your streak!</p>

          {/* Streak Banner */}
          <div className="glass rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center animate-pulse-glow">
                <Flame size={28} className="text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-white">{streak}</div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-green-400">{completed.size}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-amber-400">{allChallenges.length}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-purple-400">{user?.streak?.longest || streak}</div>
                <div className="text-xs text-gray-500">Longest</div>
              </div>
            </div>
            {streak >= 7 && <div className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium flex items-center gap-1"><Trophy size={14} /> 7-Day Badge!</div>}
            {streak >= 30 && <div className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium flex items-center gap-1"><Trophy size={14} /> 30-Day Consistency!</div>}
          </div>

          {/* Difficulty Solving Distribution */}
          {!loading && allChallenges.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-8 flex items-center gap-6">
              <div className="w-1/3">
                <h3 className="text-lg font-semibold text-white mb-2">Overall Progress</h3>
                <div className="text-4xl font-black text-white">{completed.size} <span className="text-xl text-gray-500 font-medium">/ {allChallenges.length}</span></div>
                <div className="text-sm text-gray-400 mt-1">Challenges Conquered</div>
              </div>
              <div className="flex-1 space-y-3">
                {['easy', 'medium', 'hard'].map(diff => {
                  const totalDiff = allChallenges.filter(c => c.difficulty === diff).length;
                  const completedDiff = allChallenges.filter(c => c.difficulty === diff && completed.has(c._id)).length;
                  const p = totalDiff > 0 ? (completedDiff / totalDiff) * 100 : 0;
                  const cColor = diff === 'easy' ? 'bg-green-500' : diff === 'medium' ? 'bg-amber-400' : 'bg-red-400';
                  
                  return (
                    <div key={diff} className="flex items-center gap-4">
                      <div className={`w-20 text-sm font-medium capitalize text-right text-transparent bg-clip-text ${diff === 'easy' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : diff === 'medium' ? 'bg-gradient-to-r from-amber-300 to-orange-500' : 'bg-gradient-to-r from-red-400 to-pink-500'}`}>{diff}</div>
                      <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full ${cColor} rounded-full transition-all duration-1000`} style={{ width: `${p}%` }} />
                      </div>
                      <div className="w-12 text-sm text-gray-400 text-right">{completedDiff}/{totalDiff}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold mx-auto mb-4 animate-pulse">GFG</div>
              <p className="text-gray-400">Loading challenges...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && allChallenges.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <Code size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Challenges Yet</h3>
              <p className="text-gray-400">The admin will post daily coding challenges. Check back soon!</p>
              {user?.role === 'admin' && (
                <a href="/admin" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all">
                  Go to Admin Panel to Create Challenges
                </a>
              )}
            </div>
          )}

          {/* Today's Challenge */}
          {!loading && todayChallenge && (
            <div className="glass rounded-2xl p-6 mb-8 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-4">
                <Zap size={16} /> TODAY&apos;S CHALLENGE
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{todayChallenge.title}</h2>
              <p className="text-gray-400 mb-4">{todayChallenge.description}</p>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${diffColors[todayChallenge.difficulty] || 'text-gray-400 bg-white/5'}`}>{todayChallenge.difficulty}</span>
                {todayChallenge.tags?.map((tag: string) => (<span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs">{tag}</span>))}
              </div>
              {todayChallenge.sampleInput && (
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-black/30"><div className="text-xs text-gray-500 mb-1">Sample Input</div><code className="text-sm text-green-400">{todayChallenge.sampleInput}</code></div>
                  <div className="p-3 rounded-lg bg-black/30"><div className="text-xs text-gray-500 mb-1">Sample Output</div><code className="text-sm text-green-400">{todayChallenge.sampleOutput}</code></div>
                </div>
              )}
              {todayChallenge.link && (
                <a href={todayChallenge.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm mb-4 inline-block">🔗 Solve on GFG →</a>
              )}
              <div className="mt-2 text-sm text-gray-500 mb-4 flex items-center gap-4">
                <span>{todayChallenge.testCases?.length || 0} Test Cases</span>
                <span>Supports Python, JS, Java, C++, C</span>
              </div>
              <div className="mt-2">
                <button onClick={() => handleComplete(todayChallenge._id)} disabled={completed.has(todayChallenge._id) || submitting === todayChallenge._id}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${completed.has(todayChallenge._id) ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25'}`}>
                  {completed.has(todayChallenge._id) ? <><CheckCircle size={18} /> Completed!</> : submitting === todayChallenge._id ? 'Submitting...' : <><Code size={18} /> Solve Challenge</>}
                </button>
              </div>
            </div>
          )}

          {/* Previous Challenges */}
          {!loading && allChallenges.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-white mb-4">📋 All Challenges</h3>
              <div className="space-y-3">
                {allChallenges.filter(c => c._id !== todayChallenge?._id).map((c, i) => (
                  <motion.div key={c._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completed.has(c._id) ? 'bg-green-500/20' : 'bg-white/5'}`}>
                        {completed.has(c._id) ? <CheckCircle size={20} className="text-green-400" /> : <Clock size={20} className="text-gray-500" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{c.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffColors[c.difficulty] || 'text-gray-400 bg-white/5'}`}>{c.difficulty}</span>
                          <span className="text-xs text-gray-500">{new Date(c.date).toLocaleDateString('en-IN')}</span>
                          {c.tags?.map((tag: string) => (<span key={tag} className="px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs">{tag}</span>))}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleComplete(c._id)} disabled={completed.has(c._id) || submitting === c._id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${completed.has(c._id) ? 'text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                      {completed.has(c._id) ? <><CheckCircle size={16}/> Done</> : submitting === c._id ? '...' : <><Code size={16}/> Solve</>}
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}
          {/* Code Editor Modal */}
          {activeChallenge && (
            <CodeEditorModal
              challenge={activeChallenge}
              onClose={() => setActiveChallenge(null)}
              onSuccess={handleModalSuccess}
            />
          )}

        </motion.div>
      </div>
    </div>
  );
}
