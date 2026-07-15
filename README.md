# ⚽ KickStats — Football Team Season Dashboard

KickStats is a premium, dark-themed real-time football team analytics dashboard powered by the `football-data.org` API. It dynamically adapts to your favorite team's primary colors, providing an immersive, statistics-focused pair-programming experience with data visualizations.

---

## 🌟 Features Breakdown

KickStats organizes season data into **8 interactive panels** accessible through a responsive sidebar navigation:

*   **📈 Season Form:** Tracks the team's cumulative points progression matchday-by-matchday using a Recharts line chart, complete with a game-by-game Win/Draw/Loss badge strip.
*   **⚽ Goals Timeline:** Renders a grouped bar chart displaying Goals Scored (GF) vs. Goals Conceded (GA) for each finished match.
*   **🏠 Home vs. Away:** Displays wins, draws, losses, goals, and games played splits using custom donut charts to contrast home and away performances.
*   **🏆 Top Scorers:** Displays a league-wide goalscorer leaderboard with a quick toggle to isolate goals scored by players of the selected team.
*   **👥 Squad Stats:** Shows a detailed, sortable table of squad members (appearances, goals, assists, yellow cards, red cards) with a clean empty state fallback.
*   **⚔️ Head-to-Head:** Compares history against any opponent in the league, showing overall records (Wins, Draws, Losses) and individual match scorelines.
*   **📅 Fixtures:** Lists upcoming fixtures showing dates, times, home/away status, and a 5-match form guide.
*   **🔄 Transfers:** Tracks the Summer 2025 transfer window, categorizing transactions into Arrivals (Green) and Departures (Red) with transfer fees.

---

## ⚙️ Tech Stack & Architecture

Built with a modern frontend stack optimized for developer experience and performance:

*   **Vite 6 & React 19:** Fast bundling and the latest React ecosystem features.
*   **TypeScript:** Type safety for API data models.
*   **Tailwind CSS v4:** Modern styling with dynamic CSS variables.
*   **React Query v5 (TanStack Query):** Handles API state, request caching, and automated refetching.
*   **Recharts:** Interactive SVG-based data visualizations.
*   **Lucide React:** Monospace-friendly, sleek iconography.

---

## 💡 Why & How It Works

### Caching & Rate-Limit Management
The free tier of the `football-data.org` API restricts clients to **10 requests per minute**. To ensure a smooth, error-free experience, KickStats integrates:
1.  **Global Stale Time:** Query cache is preserved for 5 minutes (`staleTime: 5 * 60 * 1000`) in `queryClient.ts`.
2.  **No Refetch on Window Focus:** Disables automated network calls when clicking back to the browser window.
3.  **Local Storage Persistence:** Remembers your API key, selected league, and team across sessions so you don't exhaust your request quota.

### Dynamic Color Theming
Every time you choose a team, KickStats reads the team ID and resolves its brand hex code from `teamColors.ts`. It injects custom properties `--color-accent` and `--color-accent-dim` into the document root, updating the sidebar highlight, charts, and interactive elements dynamically.

---

## 🚀 Getting Started

### 1. Get an API Key
Register for a free API key at [football-data.org/client/register](https://www.football-data.org/client/register).

### 2. Install and Launch
Clone the project, install dependencies, and run the Vite dev server:
```bash
# Clone and navigate
cd D:\kickstats

# Install packages
npm install

# Run Vite dev server
npm run dev
```

### 3. Setup Onboarding
When you load the app for the first time, a 3-step setup modal will appear:
1.  **Paste your API key** to validate connection.
2.  **Select a league** (e.g., Premier League, La Liga, Bundesliga).
3.  **Select your team** to configure the theme and load statistics.
