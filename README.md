# 🚀 GFG RIT Campus Hub

**Digital platform for the GeeksforGeeks Campus Club at Rajalakshmi Institute of Technology (RIT), Chennai.**

A comprehensive student engagement and learning platform that centralizes coding challenges, event registrations, learning resources, and AI-powered mentorship in a single premium dashboard.

---

## 🌐 Live Demo
- **Frontend (Website)**: [gf-gweb.vercel.app](https://gf-gweb.vercel.app)
- **Backend (API Engine)**: [gfgweb.onrender.com](https://gfgweb.onrender.com)

---

## 1. Project Overview
- **Objective**: To foster a competitive and collaborative coding culture at RIT by bridging the gap between DSA theory and industry-level practice.
- **Key Features**: 
  - **Real-time IDE**: Multi-language code execution powered by Piston API.
  - **AI Mentor**: Context-aware coding help using Gemini 2.0 via OpenRouter.
  - **Student Dashboard**: Visualized heatmaps, streaks, and difficulty distribution charts.
  - **Leaderboard**: Real-time point synchronization for challenges and campus events.
- **Problem Solved**: Replaces fragmented Google Forms and static sites with a unified, high-performance community ecosystem.

## 2. System Architecture
The project follows a **Modern Full-Stack Architecture** (MERN variation):

- **Frontend**: Next.js 15+ (App Router) using TypeScript, Tailwind CSS 4, and Framer Motion for premium interactivity.
- **Backend**: Node.js & Express with TypeScript for a robust, type-safe RESTful API.
- **Database**: MongoDB (Atlas) for flexible data modeling of users, challenges, and registrations.
- **AI Core**: OpenRouter integration providing structured, Markdown-formatted analysis for every code submission.

### **Data Flow**:
`User IDE` ➔ `Next.js Frontend` ➔ `Express API (JWT Validation)` ➔ `Piston API (Execution)` ➔ `Gemini AI (Analysis)` ➔ `MongoDB (Persistence)` ➔ `JSON Response`

---

## 3. Technology Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js, React 19, Tailwind CSS 4, Framer Motion, Lucide icons, React-Markdown |
| **Backend** | Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs |
| **AI / ML** | OpenRouter (google/gemini-2.0-flash-lite), prompt engineering for structured output |
| **Infrastructure**| Piston API (Code Engine), MongoDB Atlas, Vercel (Frontend), Render (Backend) |

---

## 4. Folder Structure
```text
gfg/
├── client/                   # Next.js Frontend (Next.js 15, Tailwind 4)
│   ├── src/app/              # App Router Pages (Dashboard, Challenges, Events)
│   ├── src/components/       # UI Components (AI Chat, Code Editor, Modals)
│   ├── src/lib/              # API Client (Shared logic with Auth/AI integration)
├── server/                   # Express.js Backend (Typescript)
│   ├── src/controllers/      # Business logic (AI analysis, Challenge validation)
│   ├── src/models/           # MongoDB Schemas (User, Challenge, Submission)
│   ├── src/routes/           # API Endpoints (Auth, AI, Events)
│   ├── src/middleware/       # Auth guards and Role-based access control
```

---

## 5. Core Features & Logic

### 💻 Automated Code Submission
- **Internals**: Users write code in the integrated IDE. The backend sends the payload to a sandbox (Piston API), executes it against test cases, and awards points based on performance.
- **AI Integration**: If a solution fails, the **AI Code Analyst** automatically reviews the logic and provides structured Markdown feedback (Headers, Bullet points, Labeled blocks).

### 🔥 Student Engagement (Gamification)
- **Streak Logic**: Daily activity is tracked. If a user misses a day, the streak resets. Consistent participation awards uniquebadges and higher Leaderboard placement.
- **Heatmap**: A custom SVG-based contribution graph (similar to GitHub) visualizing daily coding frequency.

---

## 6. Database Design
- **Users**: Profile info, total points, streak count, and roles (Admin/Student).
- **Challenges**: Problem statements, difficulty levels, and hidden test cases.
- **Submissions**: Historical logs of all code attempts, results, and AI feedback.
- **Events**: Registration tracking for Individual and Team-based club activities.

---

## 7. Setup & Installation
### Prerequisites
- Node.js 18+
- MongoDB Instance
- OpenRouter API Key

### Installation Steps
1. **Clone & Install**:
   ```bash
   git clone https://github.com/DIWAKARDQ/GFGweb.git
   cd GFGweb
   ```
2. **Backend Setup**:
   ```bash
   cd server && npm install
   # Create .env with MONGODB_URI and OPENROUTER_API_KEY
   npm run build && npm start
   ```
3. **Frontend Setup**:
   ```bash
   cd ../client && npm install
   # Create .env.local with NEXT_PUBLIC_API_URL
   npm run dev
   ```

---

## 🛡️ Security & Performance
- **JWT Authorization**: All user-specific requests are signed with stateless tokens for security.
- **CORS Protection**: Access is restricted to trusted campus domains to prevent cross-site attacks.
- **Sanitized Execution**: User code never runs on the main server; it is isolated in Piston containers to prevent server-side vulnerabilities.

---

## 📄 License
Team Hack Squad (AI & DS) -RIT chennai

---
Made by the **Diwakar B**
https://gf-gweb.vercel.app
