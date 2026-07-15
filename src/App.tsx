import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TeamProvider, useTeam } from './context/TeamContext'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { SetupModal } from './components/onboarding/SetupModal'
import { SeasonForm } from './components/panels/SeasonForm'
import { GoalsTimeline } from './components/panels/GoalsTimeline'
import { HomeAway } from './components/panels/HomeAway'
import { TopScorers } from './components/panels/TopScorers'
import { LeagueTable } from './components/panels/LeagueTable'
import { HeadToHead } from './components/panels/HeadToHead'
import { Fixtures } from './components/panels/Fixtures'
import { NewsFeed } from './components/panels/NewsFeed'

function AppInner() {
  const { apiKey, teamId } = useTeam()
  const needsSetup = !apiKey || !teamId

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {needsSetup && <SetupModal />}
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/form" replace />} />
            <Route path="/form"      element={<SeasonForm />} />
            <Route path="/goals"     element={<GoalsTimeline />} />
            <Route path="/homeaway"  element={<HomeAway />} />
            <Route path="/scorers"   element={<TopScorers />} />
            <Route path="/table"     element={<LeagueTable />} />
            <Route path="/h2h"       element={<HeadToHead />} />
            <Route path="/fixtures"  element={<Fixtures />} />
            <Route path="/news"      element={<NewsFeed />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <TeamProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TeamProvider>
  )
}
