'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield, User } from 'lucide-react';

declare global {
  interface Window { google?: any; }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google sign-in callback
  const handleGoogleResponse = useCallback(async (response: any) => {
    setError(''); setLoading(true);
    try {
      const data = await api.googleLogin(response.credential);
      localStorage.setItem('gfg_token', data.token);
      if (loginType === 'admin' && data.user?.role !== 'admin') {
        setError('This Google account does not have admin access.');
        setLoading(false);
        return;
      }
      router.push(data.user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }, [loginType, router]);

  // Load Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initGoogle = () => {
      if (window.google?.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'filled_black', size: 'large', width: '100%', text: 'signin_with', shape: 'pill' }
        );
      }
    };

    if (window.google?.accounts) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, [handleGoogleResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      const token = localStorage.getItem('gfg_token');
      if (!token) throw new Error('Login failed — no token received');

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          if (loginType === 'admin' && userData.role !== 'admin') {
            setError('This account does not have admin access. Please use Student login.');
            setLoading(false);
            return;
          }
          router.push(userData.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-grid">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative glass rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-green-500/25">GFG</div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your GFG RIT account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5">
          <button type="button" onClick={() => setLoginType('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${loginType === 'student' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            <User size={16} /> Student
          </button>
          <button type="button" onClick={() => setLoginType('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${loginType === 'admin' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            <Shield size={16} /> Admin
          </button>
        </div>

        {loginType === 'admin' && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-2">
            <Shield size={14} /> Admin login — manage events, challenges, users & analytics
          </div>
        )}

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1.5 block">
              {loginType === 'admin' ? 'Admin Email' : 'Student Email'}
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder={loginType === 'admin' ? 'admin@ritchennai.edu.in' : 'student@ritchennai.edu.in'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${loginType === 'admin' ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-amber-500/25' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/25'}`}>
            {loading ? 'Signing in...' : <><span>Sign In as {loginType === 'admin' ? 'Admin' : 'Student'}</span><ArrowRight size={16} /></>}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Sign-In */}
        {GOOGLE_CLIENT_ID ? (
          <div id="google-signin-btn" className="flex justify-center" />
        ) : (
          <button disabled
            className="w-full py-3 rounded-xl border border-white/10 text-gray-400 font-medium flex items-center justify-center gap-3 cursor-not-allowed opacity-60">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
            <span className="text-xs text-gray-600">(setup required)</span>
          </button>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account? <Link href="/register" className="text-green-400 hover:text-green-300 font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
