# DEPLOYMENT.md 🚀

This guide provides step-by-step instructions to deploy the **GFG RIT Campus Hub** to the web so anyone can access it. We recommend using **Render** for the backend and **Vercel** for the frontend as they are the most beginner-friendly and offer free tiers.

---

## Part 1: Backend Deployment (Render)
Render is an excellent platform for hosting Node.js/Express APIs.

1.  **Create an Account**: Sign up at [render.com](https://render.com) using your GitHub account.
2.  **New Web Service**:
    *   Click **New +** and select **Web Service**.
    *   Connect your GitHub repository `GFGweb`.
3.  **Configure Service**:
    *   **Name**: `gfg-rit-server`
    *   **Root Directory**: `server`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  **Add Environment Variables**:
    *   Go to the **Environment** tab and add the following keys from your `server/.env`:
        *   `MONGODB_URI`: (Your MongoDB connection string)
        *   `JWT_SECRET`: (Any secure random string)
        *   `OPENROUTER_API_KEY`: (Your OpenRouter key)
        *   `NODE_ENV`: `production`
        *   `NEXT_PUBLIC_APP_URL`: (You will update this later with the Frontend URL)
5.  **Deploy**: Click **Create Web Service**. Once finished, Render will give you a URL like `https://gfg-rit-server.onrender.com`. **Copy this URL.**

---

## Part 2: Frontend Deployment (Vercel)
Vercel is the creator of Next.js and provides the best hosting experience for it.

1.  **Create an Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.
2.  **Import Project**:
    *   Click **Add New...** -> **Project**.
    *   Import your `GFGweb` repository.
3.  **Configure Project**:
    *   **Project Name**: `gfg-rit-campus`
    *   **Framework Preset**: `Next.js`
    *   **Root Directory**: `client`
4.  **Add Environment Variables**:
    *   Expand the **Environment Variables** section and add:
        *   `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com/api` (Paste the Render URL you copied earlier and add `/api` at the end).
        *   `NEXT_PUBLIC_APP_URL`: `https://your-vercel-domain.vercel.app` (The URL Vercel gives you).
        *   `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: (Your Google ID from `.env.local`)
5.  **Deploy**: Click **Deploy**. Vercel will build your site and provide a live production URL.

---

## Part 3: Connecting the Two (Final Step)
For security (CORS), the backend needs to know the frontend's address.

1.  Go back to your **Render Web Service** dashboard.
2.  Go to **Environment**.
3.  Update the `NEXT_PUBLIC_APP_URL` variable with your new **Vercel URL** (e.g., `https://gfg-rit-campus.vercel.app`).
4.  Save and the backend will restart.

---

## Verification
*   Visit your Vercel URL.
*   Try loggin in or asking the AI a question.
*   If the AI responds, the frontend and backend are communicating perfectly!

### Common Troubleshooting
*   **Mixed Content**: Ensure your API URL in Vercel starts with `https://` (not `http://`).
*   **Database Access**: In MongoDB Atlas, go to **Network Access** and ensure "Allow Access from Anywhere" (0.0.0.0/0) is enabled so Render can connect.
