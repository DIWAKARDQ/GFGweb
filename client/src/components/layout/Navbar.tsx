'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { t, languages } from '@/lib/i18n';
import { Menu, X, Sun, Moon, Monitor, Globe, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('en');

  const navLinks = [
    { href: '/', label: t('nav.home', lang) },
    { href: '/events', label: t('nav.events', lang) },
    { href: '/resources', label: t('nav.resources', lang) },
    { href: '/challenges', label: t('nav.challenges', lang) },
    { href: '/leaderboard', label: t('nav.leaderboard', lang) },
  ];

  const themeIcons = { dark: <Moon size={16} />, light: <Sun size={16} />, system: <Monitor size={16} /> };
  const nextTheme = (): void => {
    const themes: ('dark' | 'light' | 'system')[] = ['dark', 'light', 'system'];
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-green-500/25">
              GFG
            </div>
            <span className="font-bold text-lg text-white hidden sm:block group-hover:text-green-400 transition-colors">
              RIT Campus Hub
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button onClick={nextTheme} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all" title={`Theme: ${theme}`}>
              {themeIcons[theme]}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link href="/admin" className="p-2 rounded-lg text-amber-400 hover:bg-white/10 transition-all" title="Admin">
                    <Shield size={16} />
                  </Link>
                )}
                <Link href="/dashboard" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Dashboard">
                  <LayoutDashboard size={16} />
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-300 hidden lg:block">{user.name}</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                  {t('nav.login', lang)}
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all">
                  {t('nav.register', lang)}
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10">
              <div className="py-3 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10">Dashboard</Link>
                    <Link href="/ai" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10">AI Assistant</Link>
                    <Link href="/settings" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10">Settings</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
