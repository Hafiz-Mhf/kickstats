import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getTeamColor } from '../lib/teamColors'
import type { TeamContextValue } from '../types'

const TeamContext = createContext<TeamContextValue | null>(null)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>(
    () => localStorage.getItem('ks_api_key') ?? ''
  )
  const [teamId, setTeamIdState] = useState<number | null>(() => {
    const v = localStorage.getItem('ks_team_id')
    return v ? Number(v) : null
  })
  const [competitionId, setCompetitionIdState] = useState<number | null>(() => {
    const v = localStorage.getItem('ks_competition_id')
    return v ? Number(v) : null
  })
  const [teamColor, setTeamColorState] = useState<string>('#00ff87')

  function setApiKey(key: string) {
    localStorage.setItem('ks_api_key', key)
    setApiKeyState(key)
  }
  function setTeamId(id: number) {
    localStorage.setItem('ks_team_id', String(id))
    setTeamIdState(id)
    const color = getTeamColor(id)
    document.documentElement.style.setProperty('--color-accent', color)
    document.documentElement.style.setProperty('--color-accent-dim', color + '22')
    setTeamColorState(color)
  }
  function setCompetitionId(id: number) {
    localStorage.setItem('ks_competition_id', String(id))
    setCompetitionIdState(id)
  }
  function setTeamColor(color: string) { setTeamColorState(color) }

  useEffect(() => {
    if (teamId) {
      const color = getTeamColor(teamId)
      document.documentElement.style.setProperty('--color-accent', color)
      document.documentElement.style.setProperty('--color-accent-dim', color + '22')
      setTeamColorState(color)
    }
  }, [])

  return (
    <TeamContext.Provider value={{
      apiKey, teamId, competitionId, teamColor,
      setApiKey, setTeamId, setCompetitionId, setTeamColor,
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam(): TeamContextValue {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be used within TeamProvider')
  return ctx
}
