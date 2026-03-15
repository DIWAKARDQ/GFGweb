'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string; name: string; email: string; role: string; avatar: string;
  bio?: string; githubUsername?: string; githubData?: any; streak?: any;
  language?: string; theme?: string; notifications?: boolean;
}

interface AuthContextType {
  user: User | null; token: string | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void; setUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('gfg_token');
    if (stored) {
      setToken(stored);
      api.getMe().then(u => { setUser(u); setLoading(false); }).catch(() => { localStorage.removeItem('gfg_token'); setLoading(false); });
    } else { setLoading(false); }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    localStorage.setItem('gfg_token', data.token);
    setToken(data.token); setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.register({ name, email, password });
    localStorage.setItem('gfg_token', data.token);
    setToken(data.token); setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('gfg_token');
    setToken(null); setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
