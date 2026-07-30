# deemfolio

[![Live Demo](https://img.shields.io/badge/Live-me.deem.my-7c8aff?style=flat-square&logo=vercel)](https://me.deem.my)
[![Stack](https://img.shields.io/badge/Stack-React_%7C_TypeScript_%7C_Three.js-6ee7b7?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square)](LICENSE)

> **Personal portfolio & system dashboard** — interactive 3D experience built with React, TypeScript, Three.js, and Framer Motion. Deployed with an Express backend for real-time Discord presence, Twitch status polling, and server monitoring.

---

## Overview

deemfolio is a cyberpunk-themed developer portfolio that doubles as a live status dashboard. It features a custom terminal, real-time Discord presence (via Lanyard WebSocket), Twitch stream status with viewer analytics, interactive 3D globe visualizing the tech stack, and a full server health monitoring page.

### What's inside

- **3D Hero Scene** — Particle systems, wireframe geometries, and orbital rings using Three.js / React Three Fiber
- **Interactive TechGlobe** — Lat/lng-placed technology markers with auto-rotation and pointer tracking
- **Custom Cursor** — Spring-animated cursor with hover detection on links and buttons
- **Mini Terminal** — In-browser terminal emulator with `whoami`, `neofetch`, `ls projects`, `nav` commands, and Cyberpunk 2077 easter egg (`chippin in`)
- **Discord Presence** — Live status via Lanyard WebSocket with Spotify progress tracking
- **Twitch Integration** — Server-side Twitch Helix API proxy with batch status, follower counts, and average-viewer analytics
- **Status Dashboard** — Live health checks for apps and VPS with CPU, RAM, Disk gauges and PM2 process table
- **Boot Sequence** — POST-style startup animation on first visit (skippable, respects reduced motion)
- **Johnny Silverhand** — Hidden easter egg companion with scroll-reactive dialogue
- **Lazy-loaded routes** — Code-split pages with page transitions via Framer Motion

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **3D** | Three.js, @react-three/fiber, @react-three/drei |
| **Backend** | Express.js (Node.js), dotenv |
| **APIs** | Lanyard (Discord presence), Twitch Helix (stream data) |
| **Build** | Vite, TypeScript, PostCSS, Autoprefixer |
| **Deployment** | Docker / bare-metal, PM2 process manager |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone and install all dependencies
git clone https://github.com/mkornela/deemfolio.git
cd deemfolio
npm run install:all
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_DISCORD_USER_ID` | No | Discord user ID for Lanyard presence widget (defaults to mine) |
| `TWITCH_CLIENT_ID` | For Twitch features | Twitch app client ID |
| `TWITCH_CLIENT_SECRET` | For Twitch features | Twitch app client secret |
| `PORT` | No | Server port (default: 4569) |
| `STATUS_APPS` | No | JSON array of apps to health-check |
| `VPS_HEALTH_URL` | No | HTTP endpoint for VPS system metrics |

### Development

```bash
# Starts both Vite dev server (port 5173) and Express backend (port 4569)
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:4569

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
deemfolio/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── CrazyMode.tsx        # Johnny Silverhand easter egg
│   │   │   ├── Cursor.tsx           # Custom animated cursor
│   │   │   ├── DiscordPresence.tsx  # Lanyard-powered presence card
│   │   │   ├── HeroScene.tsx        # 3D particle background
│   │   │   ├── LiveTicker.tsx       # Bottom status ticker bar
│   │   │   ├── MiniTerminal.tsx     # In-browser terminal emulator
│   │   │   ├── Navigation.tsx       # Nav bar with scroll/hide behavior
│   │   │   ├── NeonCard.tsx         # 3D tilt card container
│   │   │   ├── ProjectCard.tsx      # Project preview card
│   │   │   ├── TechGlobe.tsx        # Interactive 3D technology globe
│   │   │   └── ...more
│   │   ├── pages/           # Route-level page components
│   │   │   ├── Home.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Entertainment.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Status.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── data/            # Static content (projects, experience, socials)
│   │   ├── config/          # Environment config
│   │   ├── types/           # TypeScript types
│   │   └── lib/             # Utility functions
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
├── server/                  # Express backend
│   └── server.js            # API proxy + status monitoring
├── package.json             # Root workspace scripts
└── .env.example             # Environment variable template
```

---

## API Endpoints

| Route | Description |
|-------|-------------|
| `GET /api/health` | Health check |
| `GET /api/status` | Full status dashboard data (apps + VPS) |
| `GET /api/status/apps` | Application health checks only |
| `GET /api/status/vps` | VPS health data only |
| `GET /api/twitch/status?channel=` | Twitch stream status for one channel |
| `GET /api/twitch/status/batch?channels=` | Batch stream status (comma-separated) |
| `GET /api/twitch/users?login=` | Twitch user profile |
| `GET /api/twitch/average-viewers?channels=` | Average viewer counts |

---

## Features

### 🎨 Design
- Dark cyberpunk theme with accent gradients (cyan, magenta, purple, lime)
- Glassmorphism cards with animated neon borders
- Scroll-triggered reveal animations (respects `prefers-reduced-motion`)
- Fully responsive (mobile, tablet, desktop)

### 🖥️ Interactive
- 3D tilt cards on hover
- Custom cursor with spring physics
- Typewriter effect for activity descriptions
- IdentitySwap — animated name toggle between "Michał Kornela" and "deem"
- Hidden easter egg (type `chippin in` in the terminal)

### 🔌 Real-time
- Discord presence via WebSocket with automatic REST fallback
- Twitch stream status polling (every 20s)
- Live server uptime ticker in the status bar
- Auto-refresh on visibility change (tab focus)

### ♿ Accessibility
- Respects `prefers-reduced-motion`
- Semantic HTML structure
- Keyboard-navigable navigation
- Screen-reader-friendly labels

---

## Deployment

The site is live at **[me.deem.my](https://me.deem.my)** running on a Linux VPS behind Nginx with PM2 process management.

```bash
npm run build         # Build the client
npm start             # Start the Express server
```

---

## License

[MIT](LICENSE) © 2025 Michał Kornela

---

<p align="center">
  Built with React, Three.js, and way too much coffee.<br>
  <a href="https://me.deem.my">me.deem.my</a>
</p>
