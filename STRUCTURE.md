# STRUCTURE.md

## 1. Project Overview
- **Project Name**: GFG RIT Campus Hub
- **Short Description**: A comprehensive student engagement and learning platform for the GeeksforGeeks RIT Student Chapter.
- **Purpose**: To centralize coding challenges, event registrations, learning resources, and AI-powered mentorship in a single premium dashboard.
- **Problem Solved**: Replaces fragmented systems (Google Forms for events, external platforms for coding) with a unified, high-performance community hub.
- **Target Users**: RIT students, GFG chapter members, and club administrators.
- **Key Features**: 
  - Real-time Coding IDE with automated testing.
  - AI-powered chat and code analyst.
  - Interactive student dashboard with heatmaps and streaks.
  - Event registration and leaderboard tracking.
- **Real-world Impact**: Boosts student coding consistency through gamification and provides instant 24/7 AI tutoring.

## 2. Motivation Behind the Project
- **Why Created**: To foster a competitive and collaborative coding culture at RIT.
- **Problems in Existing Systems**: Static websites often lack interactivity and student tracking. Manually evaluating coding submissions is slow and error-prone.
- **The Solution**: Automating the evaluation process with Piston API and providing instant feedback via Gemini AI makes learning frictionless.

## 3. System Architecture
The project follows a **Modern Full-Stack Architecture** (MERN variation):
- **Frontend**: Next.js 15+ (App Router) for Server-Side Rendering (SSR) and Client-Side Interactivity.
- **Backend**: Node.js & Express with TypeScript for a robust, type-safe RESTful API.
- **Database**: MongoDB (NoSQL) for flexible data modeling of users, challenges, and events.
- **Core Integrations**:
  - **OpenRouter (Gemini AI)**: Unified AI engine for chat and code analysis.
  - **Piston API**: Safe, multi-language code execution engine.
  - **JWT**: Secure, stateless authentication.

**Interaction Flow**: 
User interacts with UI → React query/fetch hits Express API → Middleware validates JWT → Controller executes logic or calls External API (Gemini/Piston) → Data saved to MongoDB → JSON response returned to UI.

## 4. Technology Stack
- **Frontend**: 
  - **Next.js**: High performance, SEO optimized, and excellent developer experience.
  - **Tailwind CSS (v4)**: Modern styling with utility-first workflow.
  - **Framer Motion**: Smooth, premium micro-animations.
  - **Lucide React**: Consistent and lightweight iconography.
- **Backend**: 
  - **Express & TypeScript**: Fast, scalable, and type-safe server logic.
  - **Mongoose**: Elegant MongoDB object modeling.
- **AI Engine**: 
  - **OpenRouter**: Access to `google/gemini-2.0-flash-lite` for high-speed, structured responses.
- **Code Execution**: 
  - **Piston**: High-performance engine to run user code safely in containers.
- **Authentication**: 
  - **JWT & bcryptjs**: Industry standard for secure hashing and token-based access.

## 5. Folder Structure
```text
/gfg
├── /client                 # Next.js Frontend
│   ├── /public             # Static assets (images, icons)
│   ├── /src
│   │   ├── /app            # Pages and Layouts (Dashboard, Challenges, etc.)
│   │   ├── /components     # Reusable UI (Modals, Navigation, AI Chat)
│   │   ├── /lib            # API client (Axios-like wrapper) and Utils
│   │   └── /hooks          # Custom React hooks
├── /server                 # Node.js Backend
│   ├── /src
│   │   ├── /controllers    # Logic for Auth, AI, Challenges, Events
│   │   ├── /models         # MongoDB Schemas (User, Challenge, Submission)
│   │   ├── /routes         # API Route definitions
│   │   ├── /middleware     # Role Guards (Admin/User) and JWT Auth
│   │   ├── /config         # Database and Environment configuration
│   └── .env                # Secret keys (API keys, DB string)
```

## 6. Core Modules / Features

### Coding Challenge System
- **Usage**: Students solve daily/weekly DSA problems directly in the browser.
- **Internals**: Code is sent to the backend, which proxies the request to the Piston API. Results are validated against hidden test cases.
- **Tech**: React-CodeMirror (expected), Piston API, Node.js.

### Global AI Assistant
- **Usage**: A persistent floating widget available on all pages for instant help.
- **Internals**: Uses an OpenRouter-backed controller with structured Markdown rendering via `react-markdown`.
- **Tech**: OpenRouter, Gemini 2.0, Framer Motion.

### Integrated Student Dashboard
- **Usage**: Visualizes student progress, streaks, and upcoming events.
- **Internals**: Aggregates MongoDB data using Mongoose `$group` and `$match` pipelines to generate heatmaps and difficulty distributions.
- **Tech**: Chart.js, Tailwind CSS.

## 7. Data Flow
1. **Request**: User inputs code in the Challenge IDE.
2. **Transfer**: Client sends payload `{ code, language, id }` to `/api/challenges/:id/submit`.
3. **Execution**: Server calls Piston API to run the code against stored `testCases`.
4. **Processing**: Backend compares outputs, awards points via `LeaderboardEntry`, and updates user `streak`.
5. **Response**: Frontend displays pass/fail status and triggers the AI to explain any failures.

## 8. Algorithms / Logic Used
- **Streak Calculation**: Logic to check `lastActive` date. If `(now - lastActive) == 1 day`, increment; if `> 1 day`, reset.
- **Leaderboard Ranking**: Automated sorting algorithms to rank users by `totalPoints` across weekly, monthly, and all-time periods.
- **AI Formatting**: System prompts designed to convert unstructured model thoughts into clean Markdown headers and bullet points.

## 9. Database Design (MongoDB)
| Collection | Key Fields | Purpose |
|------------|------------|---------|
| **Users** | `username`, `email`, `role`, `streak` | Profile and progress tracking. |
| **Challenges** | `title`, `description`, `testCases`, `difficulty` | Centralized problem storage. |
| **Submissions**| `userId`, `challengeId`, `code`, `result` | Historical code attempts and logs. |
| **Events** | `name`, `date`, `registrations` | Tracking campus activity. |

## 10. API Design
- **Auth**: `POST /api/auth/login` - Authenticates and returns JWT.
- **Challenges**: `POST /api/challenges/:id/submit` - Executes code and returns results.
- **AI**: `POST /api/ai/chat` - Returns structured mentorship responses.
- **Resources**: `GET /api/resources` - Fetches GFG learning modules.

## 11. Setup and Installation Guide
### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- OpenRouter API Key

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd gfg

# Setup Server
cd server
npm install
# Create .env with MONGODB_URI and OPENROUTER_API_KEY
npm run dev

# Setup Client
cd ../client
npm install
# Create .env.local with NEXT_PUBLIC_API_URL
npm run dev
```

## 12. Usage Guide
1. **Register/Login**: Access your account with student credentials.
2. **Dashboard**: View your current coding streak and recommended tasks.
3. **Challenges**: Pick a problem, select your language, and run the code. Use "Ask AI" for help.
4. **Events**: Join RIT campus events and see your name on the Leaderboard.

## 13. Security Considerations
- **JWT Protection**: All sensitive routes require a valid bearer token.
- **Piston Sandbox**: Code is executed in isolated containers to prevent server-side attacks.
- **Helmet.js**: Implemented to secure HTTP headers and prevent cross-site scripting.
- **Rate Limiting**: Prevents brute-force attacks on the Auth and AI endpoints.

## 14. Scalability
- **Horizontal Scaling**: The Express server can be containerized with Docker and scaled using Kubernetes.
- **Database**: MongoDB Atlas provides auto-scaling clusters for high availability.
- **Caching**: Future-proofed for Redis integration to speed up Leaderboard queries.

## 15. Limitations
- **External Dependencies**: Relies on Piston for code execution; uptime depends on their API availability.
- **Mobile Experience**: Optimized for web; native iOS/Android apps are in the roadmap.

## 16. Future Improvements
- **Live Collaborative Coding**: Real-time room-based problem solving.
- **Plagiarism Detection**: Automated system to flag copied code submissions.
- **Discord Bot**: Integration to sync student chapter activity with the Discord server.

## 17. Real-world Applications
- **Campus Training**: Can be used by RIT faculty for internal assessments.
- **Recruitment**: Provides a verified portfolio of coding consistency for placement drives.

## 18. Conclusion
The GFG RIT Campus Hub is more than just a website; it is an intelligent, automated ecosystem designed to empower student developers. By combining the power of AI with a robust coding environment, it effectively Bridges the gap between theory and industry-level practice.
