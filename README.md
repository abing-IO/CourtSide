# Courtside Pro Scoreboard 🏀

Courtside Pro is a broadcast-quality, zero-latency sports scoreboard application built specifically for LED walls, broadcast streams (OBS), and courtside displays. It features a complete mobile-responsive Control Panel and real-time synchronization across unlimited screens.

## 🚀 Features

- **Zero-Latency Real-Time Sync**: Powered by a custom Socket.io Node.js backend. Changes on the Control Panel reflect on all displays instantly.
- **Precision Delta Time Clocks**: The Game Clock and Shot Clock run on a true server-side Delta Time engine with smooth 60fps client-side interpolation, making them immune to browser tab sleeping and network lag.
- **Persistent Database**: Integrated with Supabase. Never lose a score to a browser crash. State is saved automatically, and finished matches can be archived.
- **Broadcast-Grade Security**: 
  - **Native Basic Auth**: The `/control` panel is completely locked down behind a user-defined passcode.
  - **WebSocket Protection**: The Socket.io connection requires token authentication to accept state changes, preventing unauthorized scripts from hijacking the score.
- **Multiple Display Modes**: 
  - `/display/scoreboard` (Main In-Game HUD)
  - `/display/countdown` (Pre-game Countdown Ring)
  - `/display/halftime` (Halftime Stats/Break)
  - `/display/fulltime` (Final Score Summary)
- **Mobile-Ready Control Panel**: The operator dashboard (`/control`) is built with responsive CSS grids, making it perfectly usable on courtside phones or iPads.
- **Broadcast Ready**: Built with Next.js and Tailwind CSS. The UI scales fluidly using `vmin` units, guaranteeing perfect proportions whether viewed on a 1080p monitor or a massive arena LED matrix.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Real-Time Engine**: Socket.io (Client & Server)
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Language**: TypeScript

## ⚙️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the project and add your Supabase connection keys, as well as an admin passcode to secure the app:
```env
# Optional: Secures the /control panel with a Basic Auth prompt
ADMIN_PASSCODE=your_super_secret_password

# Optional: Cloud Database Connection
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Development Server
```bash
npm run dev
```

The application will be available at:
- **Landing Page**: `http://localhost:3000`
- **Control Panel**: `http://localhost:3000/control`
- **Main Scoreboard**: `http://localhost:3000/display/scoreboard`

## 🌍 Production Deployment

Because this application utilizes persistent Websockets (Socket.io) for the real-time engine, it is highly recommended to deploy this to a platform that supports long-running Node.js processes, such as:

- **Render.com** (Recommended)
- **Railway.app**

*(Note: "Serverless" platforms like Vercel or Netlify may drop the Socket.io connection if the function goes idle.)*

**Build & Start Commands (configured for production):**
```bash
npm run build
npm run start
```

## 📝 Usage

1. **Connect to the Network**: Ensure the laptop/server running the app is connected to the arena network.
2. **Open the Displays**: Open the display URLs (e.g., `/display/scoreboard`) on the machines connected to your LED walls or within your broadcast software as Browser Sources.
3. **Control the Game**: The operator can navigate to the `/control` URL on any tablet or smartphone connected to the same network to manage the game in real time.

## ⚖️ License

Courtside Pro Scoreboard - Copyright (c) 2025 Abin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
