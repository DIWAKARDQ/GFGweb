const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gfg_token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

export const api = {
  // Auth
  register: (body: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: (credential: string) => request('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  getMe: () => request('/auth/me'),
  getGitHubAuthUrl: () => request('/auth/github'),

  // Users
  getUser: (id: string) => request(`/users/${id}`),
  updateUser: (id: string, body: any) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  getAllUsers: () => request('/users'),
  deleteUser: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),
  getUserStats: () => request('/users/stats'),

  // Events
  getEvents: () => request('/events'),
  getEvent: (id: string) => request(`/events/${id}`),
  createEvent: (body: any) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
  updateEvent: (id: string, body: any) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEvent: (id: string) => request(`/events/${id}`, { method: 'DELETE' }),
  registerForEvent: (id: string, body: any) => request(`/events/${id}/register`, { method: 'POST', body: JSON.stringify(body) }),
  getMyEvents: () => request('/events/my'),
  getEventRegistrations: (id: string) => request(`/events/${id}/registrations`),

  // Challenges
  getChallenges: () => request('/challenges'),
  getTodayChallenge: () => request('/challenges/today'),
  getChallenge: (id: string) => request(`/challenges/${id}`),
  createChallenge: (body: any) => request('/challenges', { method: 'POST', body: JSON.stringify(body) }),
  updateChallenge: (id: string, body: any) => request(`/challenges/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteChallenge: (id: string) => request(`/challenges/${id}`, { method: 'DELETE' }),
  submitChallenge: async (id: string, code?: string, language?: string) => {
    if (code && language) {
      // New code execution endpoint
      const res = await request(`/challenges/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ code, language }),
      });
      return res; // request already returns parsed JSON
    } else {
      // Legacy mark-as-complete
      return request(`/challenges/${id}/submit`, { method: 'POST' });
    }
  },
  explainCode: (code: string, language: string) => request('/challenges/ai/explain', {
    method: 'POST',
    body: JSON.stringify({ code, language }),
  }),
  getMySubmissions: () => request('/challenges/user/submissions'),
  getCodingStats: () => request('/challenges/user/stats'),

  // Resources
  getResources: (params?: string) => request(`/resources${params ? `?${params}` : ''}`),
  createResource: (body: any) => request('/resources', { method: 'POST', body: JSON.stringify(body) }),
  updateResource: (id: string, body: any) => request(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteResource: (id: string) => request(`/resources/${id}`, { method: 'DELETE' }),

  // Achievements
  getAchievements: () => request('/achievements'),
  getUserAchievements: (userId: string) => request(`/achievements/user/${userId}`),
  createAchievement: (body: any) => request('/achievements', { method: 'POST', body: JSON.stringify(body) }),
  awardAchievement: (body: any) => request('/achievements/award', { method: 'POST', body: JSON.stringify(body) }),

  // Feedback
  submitFeedback: (body: any) => request('/feedback', { method: 'POST', body: JSON.stringify(body) }),
  getAllFeedback: () => request('/feedback'),
  getFeedbackStats: () => request('/feedback/stats'),

  // Leaderboard
  getLeaderboard: (filter?: string) => request(`/leaderboard${filter ? `?filter=${filter}` : ''}`),

  // AI
  askAI: (prompt: string) => request('/challenges/ai/explain', {
    method: 'POST',
    body: JSON.stringify({ code: '', language: 'javascript', prompt: prompt })
  }),
  aiChat: (body: any) => request('/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
  aiRecommend: (body: any) => request('/ai/recommend', { method: 'POST', body: JSON.stringify(body) }),

  // GitHub
  syncGitHub: () => request('/github/sync', { method: 'POST' }),
  getGitHubStats: (userId: string) => request(`/github/stats/${userId}`),
  connectGitHub: (username: string) => request('/github/connect', { method: 'POST', body: JSON.stringify({ username }) }),
};
