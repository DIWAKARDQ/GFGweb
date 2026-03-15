'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Globe, Github, Bell, User, Save, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { languages } from '@/lib/i18n';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [githubUsername, setGithubUsername] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const [saved, setSaved] = useState(false);
  const [lang, setLang] = useState('en');

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const themes = [
    { key: 'dark' as const, label: 'Dark', icon: <Moon size={18} />, color: 'from-gray-600 to-gray-800' },
    { key: 'light' as const, label: 'Light', icon: <Sun size={18} />, color: 'from-amber-400 to-orange-500' },
    { key: 'system' as const, label: 'System', icon: <Monitor size={18} />, color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-grid py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">⚙️ Settings</h1>
          <p className="text-gray-400 mb-8">Customize your experience</p>

          <div className="space-y-6">
            {/* Theme */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Sun size={18} /> Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {themes.map(t => (
                  <button key={t.key} onClick={() => setTheme(t.key)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === t.key ? 'border-green-500 bg-green-500/10' : 'border-white/5 hover:border-white/20 bg-white/5'}`}>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-white`}>{t.icon}</div>
                    <span className="text-sm text-gray-300">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* GitHub */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Github size={18} /> GitHub Connection</h3>
              <div className="flex gap-3">
                <input type="text" value={githubUsername} onChange={e => setGithubUsername(e.target.value)} placeholder="GitHub username"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all" />
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all">Connect</button>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Bell size={18} /> Notifications</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive event reminders and challenge updates</p>
                </div>
                <button onClick={() => setNotifications(!notifications)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${notifications ? 'bg-green-500' : 'bg-gray-700'}`}>
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${notifications ? 'left-7' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Profile */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><User size={18} /> Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Display Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-all resize-none" rows={3} />
                </div>
              </div>
            </div>

            {/* Save */}
            <button onClick={handleSave}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2">
              {saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
