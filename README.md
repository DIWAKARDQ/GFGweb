# 🚀 GFG RIT Campus Hub

**Official digital platform for the GeeksforGeeks Campus Club at Rajalakshmi Institute of Technology (RIT), Chennai.**

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Express](https://img.shields.io/badge/Express.js-4.x-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Landing Page** | Hero section, about, stats, upcoming events, features showcase |
| 📅 **Event Management** | Create/edit/delete events, registration, capacity tracking |
| 📚 **Learning Resources** | DSA, Web Dev, AI/ML, Interview Prep with category tabs |
| 💻 **Daily Challenges** | Daily coding problems with streak tracking and badges |
| 📊 **Student Dashboard** | Stats, GitHub contribution graph, achievements, progress charts |
| 🏆 **Leaderboard** | Weekly/monthly/all-time rankings with point breakdowns |
| 🤖 **AI Assistant** | Chat interface for coding help, debugging, and explanations |
| ⚙️ **Settings** | Theme (dark/light), language (EN/TA/HI), GitHub, notifications |
| 🛡️ **Admin Panel** | Dashboard analytics, manage users/events/challenges/resources |
| 🔐 **Authentication** | JWT + GitHub OAuth with role-based access (student/admin) |
| 🌐 **i18n** | English, Tamil, Hindi translations |
| 📧 **Email** | Event reminders via Nodemailer |

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router) · TypeScript · Tailwind CSS 4
- Framer Motion · Lucide Icons · Radix UI
- Chart.js · i18n translations

### Backend
- Node.js · Express.js · TypeScript
- MongoDB + Mongoose · JWT · bcrypt
- OpenAI API · GitHub API · Nodemailer

---

## 📁 Project Structure

```
gfg/
├── client/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/              # Pages (App Router)
│   │   │   ├── page.tsx      # Landing page
│   │   │   ├── login/        # Login
│   │   │   ├── register/     # Register
│   │   │   ├── events/       # Events listing
│   │   │   ├── resources/    # Learning resources
│   │   │   ├── challenges/   # Daily challenges
│   │   │   ├── dashboard/    # Student dashboard
│   │   │   ├── leaderboard/  # Rankings
│   │   │   ├── ai/           # AI chat assistant
│   │   │   ├── settings/     # User settings
│   │   │   ├── help/         # FAQ & contact
│   │   │   ├── feedback/     # Feedback form
│   │   │   ├── admin/        # Admin panel
│   │   │   └── auth/callback # GitHub OAuth callback
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth & Theme providers
│   │   └── lib/              # API client, i18n, utils
│   └── package.json
├── server/                   # Express.js Backend
│   ├── src/
│   │   ├── index.ts          # Entry point
│   │   ├── config/db.ts      # MongoDB connection
│   │   ├── models/           # 10 Mongoose schemas
│   │   ├── controllers/      # 10 controllers
│   │   ├── routes/           # 10 route files
│   │   ├── middleware/       # auth, roleGuard, validate
│   │   └── services/         # email service
│   └── package.json
├── .env.example
├── .gitignore
└── package.json              # Root (concurrently)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install
```bash
git clone <repo-url>
cd gfg
npm run install:all
```

### 2. Configure Environment
```bash
# Copy and edit the .env files
cp .env.example server/.env
# Edit server/.env with your MongoDB URI, JWT secret, etc.
```

### 3. Run Development Servers
```bash
npm run dev
```
This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret | Optional |
| `OPENAI_API_KEY` | OpenAI API key for AI assistant | Optional |
| `SMTP_HOST/USER/PASS` | Email SMTP config | Optional |

---

## 🌍 Deployment

### Frontend → Vercel
```bash
cd client && npx vercel
```

### Backend → Render / Railway
Deploy the `server/` directory with:
- Build command: `npm run build`
- Start command: `npm start`

### Database → MongoDB Atlas
Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)

---

## 📝 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/events` | ❌ | List events |
| POST | `/api/events/:id/register` | ✅ | Register for event |
| GET | `/api/challenges/today` | ❌ | Today's challenge |
| POST | `/api/challenges/:id/submit` | ✅ | Mark challenge done |
| GET | `/api/resources?category=dsa` | ❌ | Get resources |
| GET | `/api/leaderboard?filter=weekly` | ❌ | Get leaderboard |
| POST | `/api/ai/chat` | ✅ | AI chat |
| POST | `/api/github/sync` | ✅ | Sync GitHub data |
| POST | `/api/feedback` | ✅ | Submit feedback |

---

## 👥 Roles

| Role | Capabilities |
|------|-------------|
| **Student** | View events, register, solve challenges, chat with AI, submit feedback |
| **Admin** | All student capabilities + manage events/challenges/resources/users/achievements, view analytics |

---

## 📄 License

MIT © GFG RIT Campus Club

---

Made with 💚 by the GFG RIT Team
