'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Search, X, Plus, Trash2, CheckCircle, User, Phone, Building, GraduationCap, Github, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const eventTypes = ['all', 'workshop', 'hackathon', 'seminar', 'competition', 'meetup'];
const typeColors: Record<string, string> = { workshop: 'bg-blue-500/10 text-blue-400', hackathon: 'bg-purple-500/10 text-purple-400', seminar: 'bg-amber-500/10 text-amber-400', competition: 'bg-red-500/10 text-red-400', meetup: 'bg-green-500/10 text-green-400' };
const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'AIML', 'CSD', 'Other'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all text-sm";

const emptyParticipant = { fullName: '', mobile: '', department: '', year: '', githubLink: '', gmail: '' };

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  // Registration modal state
  const [regEvent, setRegEvent] = useState<any>(null);
  const [viewingEvent, setViewingEvent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Individual form
  const [participant, setParticipant] = useState({ ...emptyParticipant });

  // Team form
  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({ ...emptyParticipant });
  const [members, setMembers] = useState<typeof emptyParticipant[]>([]);

  useEffect(() => {
    loadEvents();
    if (user) loadMyRegistrations();
  }, [user]);

  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch { setEvents([]); } finally { setLoading(false); }
  };

  const loadMyRegistrations = async () => {
    try {
      const myEvents = await api.getMyEvents();
      const ids = new Set<string>((Array.isArray(myEvents) ? myEvents : []).map((e: any) => e._id));
      setRegistered(ids);
    } catch {}
  };

  const isTeamEvent = (type: string) => type === 'hackathon' || type === 'competition';

  const openRegistration = (event: any) => {
    if (!user) { alert('Please login to register for events'); return; }
    setRegEvent(event);
    setParticipant({ ...emptyParticipant, fullName: user.name || '', gmail: user.email || '' });
    setLeader({ ...emptyParticipant, fullName: user.name || '', gmail: user.email || '' });
    setTeamName('');
    setMembers([]);
    setShowSuccess(false);
  };

  const addMember = () => {
    setMembers([...members, { ...emptyParticipant }]);
  };

  const removeMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const updateMember = (idx: number, field: string, value: string) => {
    setMembers(members.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async () => {
    if (!regEvent) return;
    setSubmitting(true);

    try {
      let body: any;
      if (isTeamEvent(regEvent.type)) {
        // Validate team
        if (!teamName.trim()) { alert('Team Name is required'); setSubmitting(false); return; }
        if (!leader.fullName || !leader.mobile || !leader.department || !leader.year) {
          alert('Leader details (Name, Mobile, Department, Year) are required'); setSubmitting(false); return;
        }
        body = {
          registrationType: 'team',
          team: { teamName: teamName.trim(), leader, members },
        };
      } else {
        // Validate individual
        if (!participant.fullName || !participant.mobile || !participant.department || !participant.year) {
          alert('Full Name, Mobile, Department, and Year are required'); setSubmitting(false); return;
        }
        body = {
          registrationType: 'individual',
          participant,
        };
      }

      await api.registerForEvent(regEvent._id, body);
      setRegistered(prev => { const s = new Set(prev); s.add(regEvent._id); return s; });
      setEvents(prev => prev.map(e => e._id === regEvent._id ? { ...e, registeredCount: e.registeredCount + (isTeamEvent(regEvent.type) ? 1 + members.length : 1) } : e));
      setShowSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = events.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">📅 Events</h1>
          <p className="text-gray-400 mb-8">Discover and register for upcoming club events</p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {eventTypes.map(type => (
                <button key={type} onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === type ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Loading / Empty */}
          {loading && (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold mx-auto mb-4 animate-pulse">GFG</div>
              <p className="text-gray-400">Loading events...</p>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
              <p className="text-gray-400">Events will be created by the admin. Check back soon!</p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event, i) => (
                <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setViewingEvent(event)}
                  className="glass rounded-2xl overflow-hidden card-hover group cursor-pointer">
                  <div className="h-36 bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center relative">
                    <Calendar size={40} className="text-green-400 group-hover:scale-110 transition-transform" />
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${typeColors[event.type] || 'bg-gray-500/10 text-gray-400'}`}>
                      {event.type}
                    </span>
                    {isTeamEvent(event.type) && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                        👥 Team Event
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} /> {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14} /> {event.location}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500"><Users size={14} /> {event.registeredCount}/{event.capacity} registered</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {event.tags?.slice(0, 3).map((tag: string) => (<span key={tag} className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">{tag}</span>))}
                      {event.tags?.length > 3 && <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs">+{event.tags.length - 3}</span>}
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} />
                    </div>
                    {registered.has(event._id) ? (
                      <div className="w-full py-2.5 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium text-center flex items-center justify-center gap-2"><CheckCircle size={16} /> Registered</div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); openRegistration(event); }}
                        disabled={event.registeredCount >= event.capacity}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 relative z-10">
                        {event.registeredCount >= event.capacity ? 'Event Full' : 'Register Now'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ────────────── EVENT DETAILS MODAL ────────────── */}
      <AnimatePresence>
        {viewingEvent && !regEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[viewingEvent.type] || 'bg-gray-500/10 text-gray-400'}`}>{viewingEvent.type}</span>
                    {isTeamEvent(viewingEvent.type) && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">👥 Team Event</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{viewingEvent.title}</h2>
                </div>
                <button onClick={() => setViewingEvent(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-gray-300 mb-8 whitespace-pre-wrap leading-relaxed text-sm bg-black/20 p-5 rounded-xl border border-white/5">
                {viewingEvent.description}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12} /> Date & Time</div>
                  <div className="text-sm font-medium text-white">{new Date(viewingEvent.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin size={12} /> Location</div>
                  <div className="text-sm font-medium text-white">{viewingEvent.location}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Users size={12} /> Capacity</div>
                  <div className="text-sm font-medium text-white">{viewingEvent.registeredCount} / {viewingEvent.capacity}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User size={12} /> Required</div>
                  <div className="text-sm font-medium text-white">{isTeamEvent(viewingEvent.type) ? 'Team Entry' : 'Individual'}</div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Event Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingEvent.tags?.map((tag: string) => (<span key={tag} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">{tag}</span>))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                <a href={`/feedback?event=${viewingEvent.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-center">
                  <Mail size={16} /> Send Queries / Feedback
                </a>
                
                {registered.has(viewingEvent._id) ? (
                  <div className="flex-1 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-medium text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> You are Registered
                  </div>
                ) : (
                  <button onClick={() => { setViewingEvent(null); openRegistration(viewingEvent); }}
                    disabled={viewingEvent.registeredCount >= viewingEvent.capacity}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 flex justify-center items-center">
                    {viewingEvent.registeredCount >= viewingEvent.capacity ? 'Event Full' : 'Register for Event'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────── REGISTRATION MODAL ────────────── */}
      <AnimatePresence>
        {regEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto my-8">

              {showSuccess ? (
                /* ── Success State ── */
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Registration Successful! 🎉</h3>
                  <p className="text-gray-400 mb-2">You&apos;re registered for <span className="text-white font-medium">{regEvent.title}</span></p>
                  {isTeamEvent(regEvent.type) && (
                    <p className="text-sm text-purple-400 mb-4">Team: {teamName} ({1 + members.length} members)</p>
                  )}
                  <button onClick={() => setRegEvent(null)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all">
                    Done
                  </button>
                </div>
              ) : (
                /* ── Registration Form ── */
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Register for Event</h3>
                      <p className="text-sm text-gray-500">{regEvent.title}</p>
                    </div>
                    <button onClick={() => setRegEvent(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400"><X size={18} /></button>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[regEvent.type] || 'bg-gray-500/10 text-gray-400'}`}>{regEvent.type}</span>
                    {isTeamEvent(regEvent.type) ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">👥 Team Registration</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">👤 Individual Registration</span>
                    )}
                  </div>

                  {isTeamEvent(regEvent.type) ? (
                    /* ── Team Registration Form ── */
                    <div className="space-y-5">
                      {/* Team Name */}
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block font-medium">Team Name *</label>
                        <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Code Warriors"
                          className={inputClass} />
                      </div>

                      {/* Team Leader */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center"><User size={12} className="text-amber-400" /></div>
                          <span className="text-sm font-medium text-amber-400">Team Leader (You)</span>
                        </div>
                        <ParticipantForm data={leader} onChange={setLeader} />
                      </div>

                      {/* Team Members */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><Users size={12} className="text-blue-400" /></div>
                            <span className="text-sm font-medium text-blue-400">Team Members ({members.length})</span>
                          </div>
                          <button onClick={addMember} className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 flex items-center gap-1 transition-all">
                            <Plus size={12} /> Add Member
                          </button>
                        </div>
                        {members.length === 0 && (
                          <div className="text-center py-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10">
                            <p className="text-xs text-gray-500">No members added yet. Click &quot;Add Member&quot; to add team members.</p>
                          </div>
                        )}
                        {members.map((member, idx) => (
                          <div key={idx} className="relative mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500 font-medium">Member {idx + 1}</span>
                              <button onClick={() => removeMember(idx)} className="p-1 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
                            </div>
                            <ParticipantForm data={member} onChange={(updated) => {
                              const key = Object.keys(updated).find(k => (updated as any)[k] !== (member as any)[k]);
                              if (key) updateMember(idx, key, (updated as any)[key]);
                              else setMembers(members.map((m, i) => i === idx ? updated : m));
                            }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* ── Individual Registration Form ── */
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><User size={12} className="text-green-400" /></div>
                        <span className="text-sm font-medium text-green-400">Your Details</span>
                      </div>
                      <ParticipantForm data={participant} onChange={setParticipant} />
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                    <button onClick={() => setRegEvent(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 text-sm">Cancel</button>
                    <button onClick={handleSubmit} disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/25">
                      {submitting ? 'Registering...' : '✓ Complete Registration'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Reusable Participant Form Fields ── */
function ParticipantForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (field: string, value: string) => onChange({ ...data, [field]: value });
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={data.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Full Name"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 outline-none text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Mobile Number *</label>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={data.mobile} onChange={e => set('mobile', e.target.value)} placeholder="9876543210"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 outline-none text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Department *</label>
        <div className="relative">
          <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <select value={data.department} onChange={e => set('department', e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-green-500 outline-none text-sm appearance-none">
            <option value="" className="bg-gray-900">Select</option>
            {departments.map(d => <option key={d} value={d} className="bg-gray-900">{d}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Year of Study *</label>
        <div className="relative">
          <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <select value={data.year} onChange={e => set('year', e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-green-500 outline-none text-sm appearance-none">
            <option value="" className="bg-gray-900">Select</option>
            {years.map(y => <option key={y} value={y} className="bg-gray-900">{y}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">GitHub Profile (optional)</label>
        <div className="relative">
          <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={data.githubLink} onChange={e => set('githubLink', e.target.value)} placeholder="github.com/username"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 outline-none text-sm" />
        </div>
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-500 mb-1 block">Gmail ID (optional)</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={data.gmail} onChange={e => set('gmail', e.target.value)} placeholder="name@gmail.com"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 outline-none text-sm" />
        </div>
      </div>
    </div>
  );
}
