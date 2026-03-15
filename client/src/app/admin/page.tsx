'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Code, BookOpen, Trophy, MessageSquare, BarChart3, TrendingUp, Search, Plus, Trash2, Edit, Eye, X, Save, ChevronRight, Flame, CheckCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const tabs = [
  { key: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
  { key: 'users', label: 'Users', icon: <Users size={16} /> },
  { key: 'events', label: 'Events', icon: <Calendar size={16} /> },
  { key: 'challenges', label: 'Challenges', icon: <Code size={16} /> },
  { key: 'feedback', label: 'Feedback', icon: <MessageSquare size={16} /> },
];

// ─── Modal Component ─────────────────────────────────────────────
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400"><X size={18} /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

// ─── Form Field Component ────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-4"><label className="text-sm text-gray-400 mb-1.5 block">{label}</label>{children}</div>;
}
const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all text-sm";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [challengeSearch, setChallengeSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedbackStats, setFeedbackStats] = useState<any>({ total: 0, avgRating: 0, positive: 0 });

  // Registration viewer state
  const [viewingRegsEvent, setViewingRegsEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  // Event form state
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', type: 'workshop', capacity: 50, tags: '' });

  // Challenge form state
  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', difficulty: 'easy', date: '', tags: '', sampleInput: '', sampleOutput: '', link: '', inputFormat: '', outputFormat: '', testCases: [] as { input: string, expectedOutput: string, isHidden: boolean }[] });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersData, eventsData, challengesData, feedbackData] = await Promise.allSettled([
        api.getAllUsers(),
        api.getEvents(),
        api.getChallenges(),
        api.getAllFeedback(),
      ]);
      if (usersData.status === 'fulfilled') setUsers(Array.isArray(usersData.value) ? usersData.value : []);
      if (eventsData.status === 'fulfilled') setEvents(Array.isArray(eventsData.value) ? eventsData.value : []);
      if (challengesData.status === 'fulfilled') setChallenges(Array.isArray(challengesData.value) ? challengesData.value : []);
      if (feedbackData.status === 'fulfilled') {
        const fb = Array.isArray(feedbackData.value) ? feedbackData.value : [];
        setFeedback(fb);
        if (fb.length > 0) {
          const avg = fb.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / fb.length;
          const positive = fb.filter((f: any) => f.rating >= 4).length;
          setFeedbackStats({ total: fb.length, avgRating: avg.toFixed(1), positive: Math.round((positive / fb.length) * 100) });
        }
      }
    } catch {} finally { setLoading(false); }

    // Also try getting feedback stats from endpoint
    try { const stats = await api.getFeedbackStats(); if (stats) setFeedbackStats((prev: any) => ({ ...prev, ...stats })); } catch {}
  };

  // ─── Event CRUD ──────────────────────────────────────────
  const openCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({ title: '', description: '', date: '', location: '', type: 'workshop', capacity: 50, tags: '' });
    setShowEventModal(true);
  };

  const openEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      location: event.location || '',
      type: event.type || 'workshop',
      capacity: event.capacity || 50,
      tags: (event.tags || []).join(', '),
    });
    setShowEventModal(true);
  };

  const saveEvent = async () => {
    setSaving(true);
    try {
      const body = {
        ...eventForm,
        capacity: Number(eventForm.capacity),
        tags: eventForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingEvent) {
        await api.updateEvent(editingEvent._id, body);
      } else {
        await api.createEvent(body);
      }
      setShowEventModal(false);
      // Reload events
      const newEvents = await api.getEvents();
      setEvents(Array.isArray(newEvents) ? newEvents : []);
    } catch (err: any) {
      alert(err.message || 'Failed to save event');
    } finally { setSaving(false); }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await api.deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  };

  // ─── Challenge CRUD ────────────────────────────────────────
  const openCreateChallenge = () => {
    setEditingChallenge(null);
    setChallengeForm({ title: '', description: '', difficulty: 'easy', date: new Date().toISOString().slice(0, 16), tags: '', sampleInput: '', sampleOutput: '', link: '', inputFormat: '', outputFormat: '', testCases: [] });
    setShowChallengeModal(true);
  };

  const openEditChallenge = (challenge: any) => {
    setEditingChallenge(challenge);
    setChallengeForm({
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty || 'easy',
      date: challenge.date ? new Date(challenge.date).toISOString().slice(0, 16) : '',
      tags: (challenge.tags || []).join(', '),
      sampleInput: challenge.sampleInput || '',
      sampleOutput: challenge.sampleOutput || '',
      link: challenge.link || '',
      inputFormat: challenge.inputFormat || '',
      outputFormat: challenge.outputFormat || '',
      testCases: challenge.testCases || [],
    });
    setShowChallengeModal(true);
  };

  const saveChallenge = async () => {
    setSaving(true);
    try {
      const body = {
        ...challengeForm,
        tags: challengeForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingChallenge) {
        await api.updateChallenge(editingChallenge._id, body);
      } else {
        await api.createChallenge(body);
      }
      setShowChallengeModal(false);
      const newChallenges = await api.getChallenges();
      setChallenges(Array.isArray(newChallenges) ? newChallenges : []);
    } catch (err: any) {
      alert(err.message || 'Failed to save challenge');
    } finally { setSaving(false); }
  };

  const deleteChallenge = async (id: string) => {
    if (!confirm('Delete this challenge? This cannot be undone.')) return;
    try {
      await api.deleteChallenge(id);
      setChallenges(prev => prev.filter(c => c._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete challenge');
    }
  };

  // ─── View Registrations ────────────────────────────────────
  const openRegistrations = async (event: any) => {
    setViewingRegsEvent(event);
    setLoadingRegs(true);
    try {
      const data = await api.getEventRegistrations(event._id);
      setRegistrations(Array.isArray(data) ? data : []);
    } catch { setRegistrations([]); }
    finally { setLoadingRegs(false); }
  };

  // ─── User Actions ──────────────────────────────────────────
  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // ─── Stats ────────────────────────────────────────────────
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const studentCount = totalUsers - adminCount;
  const totalEvents = events.length;
  const totalChallenges = challenges.length;
  const activeStreakUsers = users.filter(u => u.streak?.current > 0).length;

  // Filter logic
  const filteredUsers = users.filter(u => userSearch === '' || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredEvents = events.filter(e => eventSearch === '' || e.title?.toLowerCase().includes(eventSearch.toLowerCase()));
  const filteredChallenges = challenges.filter(c => challengeSearch === '' || c.title?.toLowerCase().includes(challengeSearch.toLowerCase()));

  const diffColors: Record<string, string> = { easy: 'text-green-400 bg-green-500/10', medium: 'text-amber-400 bg-amber-500/10', hard: 'text-red-400 bg-red-500/10' };

  return (
    <div className="min-h-screen bg-grid">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen glass border-r border-white/10 p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">A</div>
            <div>
              <div className="font-semibold text-white text-sm">Admin Panel</div>
              <div className="text-xs text-gray-500">GFG RIT Hub</div>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === tab.key ? 'bg-green-500/10 text-green-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
          {/* Quick Stats */}
          <div className="mt-8 space-y-2 px-2">
            <div className="text-xs text-gray-600 uppercase font-medium">Quick Stats</div>
            <div className="text-sm text-gray-400"><span className="text-white font-medium">{totalUsers}</span> Users</div>
            <div className="text-sm text-gray-400"><span className="text-white font-medium">{totalEvents}</span> Events</div>
            <div className="text-sm text-gray-400"><span className="text-white font-medium">{totalChallenges}</span> Challenges</div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden w-full overflow-x-auto border-b border-white/10 px-4 fixed top-16 z-30 bg-[var(--bg-primary)]">
          <div className="flex gap-1 py-2">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${activeTab === tab.key ? 'bg-green-500/10 text-green-400' : 'text-gray-400'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8 lg:mt-0 mt-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold mx-auto mb-4 animate-pulse">A</div>
              <p className="text-gray-400">Loading admin data...</p>
            </div>
          ) : (
            <>
              {/* ──────────────── OVERVIEW TAB ──────────────── */}
              {activeTab === 'overview' && (
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                  <motion.h1 variants={fadeIn} className="text-3xl font-bold text-white mb-6">Admin Dashboard</motion.h1>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Total Users', value: totalUsers, change: `${studentCount} students, ${adminCount} admins`, icon: <Users size={22} />, color: 'from-blue-500 to-cyan-600' },
                      { label: 'Active Streaks', value: activeStreakUsers, change: `of ${totalUsers} users`, icon: <Flame size={22} />, color: 'from-orange-500 to-red-600' },
                      { label: 'Events', value: totalEvents, change: `${events.filter(e => new Date(e.date) > new Date()).length} upcoming`, icon: <Calendar size={22} />, color: 'from-purple-500 to-violet-600' },
                      { label: 'Challenges', value: totalChallenges, change: 'posted', icon: <Code size={22} />, color: 'from-green-500 to-emerald-600' },
                    ].map((stat, i) => (
                      <motion.div key={i} variants={fadeIn} className="glass rounded-2xl p-5 card-hover">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>{stat.icon}</div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-400">{stat.label}</span>
                          <span className="text-xs text-green-400">{stat.change}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Event Registrations Summary */}
                    <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">📅 Event Registrations</h3>
                      {events.length === 0 ? (
                        <p className="text-gray-500 text-sm">No events created yet. Go to the Events tab to create one.</p>
                      ) : (
                        <div className="space-y-3">
                          {events.slice(0, 6).map(event => (
                            <div key={event._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                              <div>
                                <div className="text-sm font-medium text-white">{event.title}</div>
                                <div className="text-xs text-gray-500">{event.date ? new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'TBA'} · {event.location}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-green-400">{event.registeredCount || 0}/{event.capacity}</div>
                                <div className="text-xs text-gray-500">registered</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Challenge Difficulty Distribution */}
                    <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">💻 Challenges by Difficulty</h3>
                      {challenges.length === 0 ? (
                        <p className="text-gray-500 text-sm">No challenges posted yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {['easy', 'medium', 'hard'].map(diff => {
                            const count = challenges.filter(c => c.difficulty === diff).length;
                            return (
                              <div key={diff}>
                                <div className="flex justify-between text-sm mb-1.5">
                                  <span className="text-gray-400 capitalize">{diff}</span>
                                  <span className="text-white font-medium">{count}</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                  <div className={`bg-gradient-to-r ${diff === 'easy' ? 'from-green-500 to-emerald-500' : diff === 'medium' ? 'from-amber-500 to-yellow-500' : 'from-red-500 to-pink-500'} h-2 rounded-full transition-all`}
                                    style={{ width: `${challenges.length > 0 ? (count / challenges.length) * 100 : 0}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>

                    {/* Recent Users */}
                    <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">👥 Recent Users</h3>
                      {users.length === 0 ? (
                        <p className="text-gray-500 text-sm">No users registered yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {users.slice(0, 5).map(user => (
                            <div key={user._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer" onClick={() => { setActiveTab('users'); setSelectedUser(user); }}>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">{(user.name || 'U').charAt(0)}</div>
                                <div>
                                  <div className="text-sm font-medium text-white">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>{user.role}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Feedback Summary */}
                    <motion.div variants={fadeIn} className="glass rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">💬 Feedback Summary</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 rounded-xl bg-white/5">
                          <div className="text-xl font-bold text-white">{feedbackStats.total}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/5">
                          <div className="text-xl font-bold text-amber-400">{feedbackStats.avgRating || '—'}</div>
                          <div className="text-xs text-gray-500">Avg Rating</div>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/5">
                          <div className="text-xl font-bold text-green-400">{feedbackStats.positive || 0}%</div>
                          <div className="text-xs text-gray-500">Positive</div>
                        </div>
                      </div>
                      {feedback.length > 0 && (
                        <div className="space-y-2">
                          {feedback.slice(0, 3).map((fb: any, i: number) => (
                            <div key={i} className="p-2 rounded-lg bg-white/[0.03] text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-gray-400 text-xs">{fb.userId?.name || 'Anonymous'}</span>
                                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => (<span key={s} className={`text-xs ${s <= (fb.rating || 0) ? 'text-amber-400' : 'text-gray-700'}`}>★</span>))}</div>
                              </div>
                              <p className="text-gray-500 text-xs line-clamp-1">{fb.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* ──────────────── USERS TAB ──────────────── */}
              {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white">Manage Users</h1>
                      <p className="text-sm text-gray-500 mt-1">{totalUsers} users ({studentCount} students, {adminCount} admins)</p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none max-w-sm" />
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* User List */}
                    <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
                      <div className="grid grid-cols-12 p-3 text-xs font-medium text-gray-500 uppercase border-b border-white/5">
                        <div className="col-span-4">User</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2 text-center">Streak</div>
                        <div className="col-span-2 text-center">Joined</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      {filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No users found.</div>
                      ) : (
                        filteredUsers.map(user => (
                          <div key={user._id} className={`grid grid-cols-12 items-center p-3 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer ${selectedUser?._id === user._id ? 'bg-green-500/5 border-l-2 border-l-green-500' : ''}`}
                            onClick={() => setSelectedUser(user)}>
                            <div className="col-span-4 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">{(user.name || 'U').charAt(0)}</div>
                              <div>
                                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                                <div className="text-xs text-gray-600 truncate">{user.email}</div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>{user.role}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm text-orange-400 flex items-center justify-center gap-1"><Flame size={12} />{user.streak?.current || 0}d</span>
                            </div>
                            <div className="col-span-2 text-center text-xs text-gray-500">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—'}
                            </div>
                            <div className="col-span-2 flex justify-end gap-1">
                              <button onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Eye size={14} /></button>
                              <button onClick={(e) => { e.stopPropagation(); deleteUser(user._id); }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* User Detail Panel */}
                    <div className="glass rounded-2xl p-6">
                      {selectedUser ? (
                        <div>
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">{(selectedUser.name || 'U').charAt(0)}</div>
                            <h3 className="font-semibold text-white">{selectedUser.name}</h3>
                            <p className="text-sm text-gray-500">{selectedUser.email}</p>
                            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${selectedUser.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>{selectedUser.role}</span>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-white/5">
                              <div className="text-xs text-gray-500">Current Streak</div>
                              <div className="text-lg font-bold text-orange-400 flex items-center gap-1"><Flame size={16} />{selectedUser.streak?.current || 0} days</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5">
                              <div className="text-xs text-gray-500">Longest Streak</div>
                              <div className="text-lg font-bold text-purple-400">{selectedUser.streak?.longest || 0} days</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5">
                              <div className="text-xs text-gray-500">GitHub</div>
                              <div className="text-sm text-white">{selectedUser.github?.username || 'Not connected'}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5">
                              <div className="text-xs text-gray-500">Joined</div>
                              <div className="text-sm text-white">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
                            </div>
                            {selectedUser.preferences && (
                              <div className="p-3 rounded-xl bg-white/5">
                                <div className="text-xs text-gray-500">Preferences</div>
                                <div className="text-sm text-white">Theme: {selectedUser.preferences.theme || 'dark'}</div>
                                <div className="text-sm text-white">Lang: {selectedUser.preferences.language || 'en'}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users size={32} className="text-gray-600 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">Select a user to view details</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ──────────────── EVENTS TAB ──────────────── */}
              {activeTab === 'events' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white">Manage Events</h1>
                      <p className="text-sm text-gray-500 mt-1">{totalEvents} events created</p>
                    </div>
                    <button onClick={openCreateEvent} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/25">
                      <Plus size={16} /> Create Event
                    </button>
                  </div>

                  <div className="relative mb-6">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input value={eventSearch} onChange={e => setEventSearch(e.target.value)} placeholder="Search events..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none max-w-sm" />
                  </div>

                  {filteredEvents.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                      <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
                      <p className="text-gray-400 mb-4">Create your first event for club members!</p>
                      <button onClick={openCreateEvent} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all inline-flex items-center gap-2">
                        <Plus size={16} /> Create Event
                      </button>
                    </div>
                  ) : (
                    <div className="glass rounded-2xl overflow-hidden">
                      {filteredEvents.map(event => (
                        <div key={event._id} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0"><Calendar size={20} className="text-green-400" /></div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white truncate">{event.title}</div>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                <span>{event.date ? new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</span>
                                <span>📍 {event.location}</span>
                                <span className="text-green-400">{event.registeredCount || 0}/{event.capacity} registered</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${event.type === 'hackathon' ? 'bg-purple-500/10 text-purple-400' : event.type === 'seminar' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>{event.type}</span>
                            <button onClick={() => openRegistrations(event)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-green-400" title="View Registrations"><Eye size={14} /></button>
                            <button onClick={() => openEditEvent(event)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400"><Edit size={14} /></button>
                            <button onClick={() => deleteEvent(event._id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ──────────────── CHALLENGES TAB ──────────────── */}
              {activeTab === 'challenges' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white">Manage Challenges</h1>
                      <p className="text-sm text-gray-500 mt-1">{totalChallenges} challenges posted</p>
                    </div>
                    <button onClick={openCreateChallenge} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/25">
                      <Plus size={16} /> Post Challenge
                    </button>
                  </div>

                  <div className="relative mb-6">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input value={challengeSearch} onChange={e => setChallengeSearch(e.target.value)} placeholder="Search challenges..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none max-w-sm" />
                  </div>

                  {filteredChallenges.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                      <Code size={48} className="text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Challenges Posted</h3>
                      <p className="text-gray-400 mb-4">Post your first daily coding challenge!</p>
                      <button onClick={openCreateChallenge} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all inline-flex items-center gap-2">
                        <Plus size={16} /> Post Challenge
                      </button>
                    </div>
                  ) : (
                    <div className="glass rounded-2xl overflow-hidden">
                      {filteredChallenges.map(challenge => (
                        <div key={challenge._id} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"><Code size={20} className="text-green-400" /></div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white truncate">{challenge.title}</div>
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffColors[challenge.difficulty] || 'text-gray-400 bg-white/5'}`}>{challenge.difficulty}</span>
                                <span className="text-gray-500">{challenge.date ? new Date(challenge.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'No date'}</span>
                                {challenge.tags?.map((tag: string) => (<span key={tag} className="px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs">{tag}</span>))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                            <button onClick={() => openEditChallenge(challenge)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400"><Edit size={14} /></button>
                            <button onClick={() => deleteChallenge(challenge._id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ──────────────── FEEDBACK TAB ──────────────── */}
              {activeTab === 'feedback' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h1 className="text-3xl font-bold text-white mb-6">Feedback Analytics</h1>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="glass rounded-2xl p-5 text-center"><div className="text-3xl font-bold text-white">{feedbackStats.total}</div><div className="text-sm text-gray-400">Total Feedback</div></div>
                    <div className="glass rounded-2xl p-5 text-center"><div className="text-3xl font-bold text-amber-400">{feedbackStats.avgRating || '—'}</div><div className="text-sm text-gray-400">Avg Rating</div></div>
                    <div className="glass rounded-2xl p-5 text-center"><div className="text-3xl font-bold text-green-400">{feedbackStats.positive || 0}%</div><div className="text-sm text-gray-400">Positive</div></div>
                  </div>
                  <div className="glass rounded-2xl overflow-hidden">
                    {feedback.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No feedback received yet.</div>
                    ) : (
                      feedback.map((fb: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">{(fb.userId?.name || 'A').charAt(0)}</div>
                            <div><div className="text-sm font-medium text-white">{fb.userId?.name || 'Anonymous'}</div><p className="text-sm text-gray-400 line-clamp-1">{fb.message}</p></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">{[1,2,3,4,5].map(s => (<span key={s} className={`text-xs ${s <= (fb.rating || 0) ? 'text-amber-400' : 'text-gray-600'}`}>★</span>))}</div>
                            <span className="text-xs text-gray-600 ml-2">{fb.category || 'general'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ──────────────── EVENT MODAL ──────────────── */}
      <Modal open={showEventModal} onClose={() => setShowEventModal(false)} title={editingEvent ? 'Edit Event' : 'Create Event'}>
        <Field label="Event Name">
          <input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g. DSA Bootcamp 2026" className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Event details..." className={`${inputClass} resize-none`} rows={3} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date & Time">
            <input type="datetime-local" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Venue / Location">
            <input value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="e.g. Seminar Hall A" className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Event Type">
            <select value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value })} className={inputClass}>
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
              <option value="meetup">Meetup</option>
            </select>
          </Field>
          <Field label="Max Capacity">
            <input type="number" value={eventForm.capacity} onChange={e => setEventForm({ ...eventForm, capacity: Number(e.target.value) })} min={1} className={inputClass} />
          </Field>
        </div>
        <Field label="Tags (comma-separated)">
          <input value={eventForm.tags} onChange={e => setEventForm({ ...eventForm, tags: e.target.value })} placeholder="e.g. DSA, Algorithms, Coding" className={inputClass} />
        </Field>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowEventModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 text-sm">Cancel</button>
          <button onClick={saveEvent} disabled={saving || !eventForm.title}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/25">
            {saving ? 'Saving...' : <><Save size={14} /> {editingEvent ? 'Update' : 'Create'}</>}
          </button>
        </div>
      </Modal>

      {/* ──────────────── REGISTRATIONS MODAL ──────────────── */}
      <Modal open={!!viewingRegsEvent} onClose={() => setViewingRegsEvent(null)} title={`Registrations — ${viewingRegsEvent?.title || ''}`}>
        {loadingRegs ? (
          <div className="text-center py-8"><p className="text-gray-400 animate-pulse">Loading registrations...</p></div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No registrations yet for this event.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-sm text-gray-400 mb-2">{registrations.length} registration(s)</p>
            {registrations.map((reg: any, idx: number) => (
              <div key={reg._id || idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                {reg.registrationType === 'team' && reg.team ? (
                  /* Team Registration */
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">👥 Team</span>
                      <span className="text-sm font-semibold text-white">{reg.team.teamName}</span>
                    </div>
                    {/* Leader */}
                    <div className="mb-3">
                      <div className="text-xs text-amber-400 font-medium mb-1.5">Team Leader</div>
                      <ParticipantRow p={reg.team.leader} />
                    </div>
                    {/* Members */}
                    {reg.team.members?.length > 0 && (
                      <div>
                        <div className="text-xs text-blue-400 font-medium mb-1.5">Members ({reg.team.members.length})</div>
                        <div className="space-y-2">
                          {reg.team.members.map((m: any, mi: number) => (
                            <ParticipantRow key={mi} p={m} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Individual Registration */
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium mb-2 inline-block">👤 Individual</span>
                    <ParticipantRow p={reg.participant} />
                  </div>
                )}
                <div className="text-xs text-gray-600 mt-2 text-right">
                  Registered: {reg.registeredAt ? new Date(reg.registeredAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ──────────────── CHALLENGE MODAL ──────────────── */}
      <Modal open={showChallengeModal} onClose={() => setShowChallengeModal(false)} title={editingChallenge ? 'Edit Challenge' : 'Post Challenge'}>
        <Field label="Challenge Title">
          <input value={challengeForm.title} onChange={e => setChallengeForm({ ...challengeForm, title: e.target.value })} placeholder="e.g. Two Sum Problem" className={inputClass} />
        </Field>
        <Field label="Problem Description">
          <textarea value={challengeForm.description} onChange={e => setChallengeForm({ ...challengeForm, description: e.target.value })} placeholder="Describe the problem statement..." className={`${inputClass} resize-none`} rows={3} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Input Format">
            <textarea value={challengeForm.inputFormat} onChange={e => setChallengeForm({ ...challengeForm, inputFormat: e.target.value })} placeholder="e.g. The first line contains T..." className={`${inputClass} resize-none`} rows={2} />
          </Field>
          <Field label="Output Format">
            <textarea value={challengeForm.outputFormat} onChange={e => setChallengeForm({ ...challengeForm, outputFormat: e.target.value })} placeholder="e.g. Print a single integer..." className={`${inputClass} resize-none`} rows={2} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Difficulty">
            <select value={challengeForm.difficulty} onChange={e => setChallengeForm({ ...challengeForm, difficulty: e.target.value })} className={inputClass}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
          <Field label="Challenge Date">
            <input type="datetime-local" value={challengeForm.date} onChange={e => setChallengeForm({ ...challengeForm, date: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <Field label="Tags (comma-separated)">
          <input value={challengeForm.tags} onChange={e => setChallengeForm({ ...challengeForm, tags: e.target.value })} placeholder="e.g. Array, Hash Table" className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sample Input">
            <textarea value={challengeForm.sampleInput} onChange={e => setChallengeForm({ ...challengeForm, sampleInput: e.target.value })} placeholder="nums = [2,7,11,15]" className={`${inputClass} resize-none`} rows={2} />
          </Field>
          <Field label="Sample Output">
            <textarea value={challengeForm.sampleOutput} onChange={e => setChallengeForm({ ...challengeForm, sampleOutput: e.target.value })} placeholder="[0,1]" className={`${inputClass} resize-none`} rows={2} />
          </Field>
        </div>
        <Field label="Problem Link (optional)">
          <input value={challengeForm.link} onChange={e => setChallengeForm({ ...challengeForm, link: e.target.value })} placeholder="https://www.geeksforgeeks.org/..." className={inputClass} />
        </Field>
        
        {/* Test Cases Manager */}
        <div className="mt-4 mb-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-300">Test Cases ({challengeForm.testCases.length})</label>
            <button
              onClick={() => setChallengeForm({ ...challengeForm, testCases: [...challengeForm.testCases, { input: '', expectedOutput: '', isHidden: true }] })}
              className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white flex items-center gap-1 transition-colors"
            >
              <Plus size={12} /> Add Case
            </button>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {challengeForm.testCases.map((tc, idx) => (
              <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl relative group">
                <button
                  onClick={() => {
                    const newTc = [...challengeForm.testCases];
                    newTc.splice(idx, 1);
                    setChallengeForm({ ...challengeForm, testCases: newTc });
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
                <div className="text-xs text-gray-400 mb-2">Test Case #{idx + 1}</div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 mb-1 block">Input</label>
                    <textarea 
                      value={tc.input} 
                      onChange={e => { const newTc = [...challengeForm.testCases]; newTc[idx].input = e.target.value; setChallengeForm({ ...challengeForm, testCases: newTc }); }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white font-mono resize-none focus:border-green-500 outline-none" 
                      rows={2} placeholder="stdin" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 mb-1 block">Expected Output</label>
                    <textarea 
                      value={tc.expectedOutput} 
                      onChange={e => { const newTc = [...challengeForm.testCases]; newTc[idx].expectedOutput = e.target.value; setChallengeForm({ ...challengeForm, testCases: newTc }); }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white font-mono resize-none focus:border-green-500 outline-none" 
                      rows={2} placeholder="stdout" 
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer w-max">
                  <input 
                    type="checkbox" 
                    checked={tc.isHidden} 
                    onChange={e => { const newTc = [...challengeForm.testCases]; newTc[idx].isHidden = e.target.checked; setChallengeForm({ ...challengeForm, testCases: newTc }); }}
                    className="accent-green-500"
                  />
                  <span className="text-xs text-gray-400">Hidden from user during attempt</span>
                </label>
              </div>
            ))}
            {challengeForm.testCases.length === 0 && (
              <div className="p-4 border border-dashed border-white/10 rounded-xl text-center text-sm text-gray-500">
                No test cases added. Your challenge will just use the "Mark as Complete" button.
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowChallengeModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 text-sm">Cancel</button>
          <button onClick={saveChallenge} disabled={saving || !challengeForm.title}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/25">
            {saving ? 'Saving...' : <><Save size={14} /> {editingChallenge ? 'Update' : 'Post'}</>}
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ── Reusable participant row for admin registration viewer ── */
function ParticipantRow({ p }: { p: any }) {
  if (!p) return <span className="text-xs text-gray-600">No details available</span>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm p-2 rounded-lg bg-white/[0.02]">
      <div><span className="text-gray-500 text-xs">Name:</span> <span className="text-white">{p.fullName}</span></div>
      <div><span className="text-gray-500 text-xs">Mobile:</span> <span className="text-white">{p.mobile}</span></div>
      <div><span className="text-gray-500 text-xs">Dept:</span> <span className="text-white">{p.department}</span></div>
      <div><span className="text-gray-500 text-xs">Year:</span> <span className="text-white">{p.year}</span></div>
      {p.githubLink && <div><span className="text-gray-500 text-xs">GitHub:</span> <span className="text-blue-400 text-xs">{p.githubLink}</span></div>}
      {p.gmail && <div><span className="text-gray-500 text-xs">Gmail:</span> <span className="text-gray-300 text-xs">{p.gmail}</span></div>}
    </div>
  );
}
