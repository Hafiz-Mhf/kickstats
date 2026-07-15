export interface TeamInfo {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  venue: string
}

export interface Competition {
  id: number
  name: string
  code: string
  emblem: string
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'

export interface Score {
  home: number | null
  away: number | null
}

export interface Match {
  id: number
  utcDate: string
  status: MatchStatus
  matchday: number | null
  homeTeam: { id: number; name: string; crest: string }
  awayTeam: { id: number; name: string; crest: string }
  score: {
    winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
    fullTime: Score
  }
}

export interface Scorer {
  player: { id: number; name: string; nationality: string }
  team: { id: number; name: string; crest: string }
  goals: number
  assists: number | null
  penalties: number | null
}

export interface Transfer {
  id: number
  transferDate: string | null
  transferFee: string | null
  season: string
  type: 'IN' | 'OUT'
  playerName: string
  teams: {
    from: { id: number; name: string } | null
    to: { id: number; name: string } | null
  }
}

export interface TeamContextValue {
  apiKey: string
  teamId: number | null
  competitionId: number | null
  teamColor: string
  setTeamId: (id: number) => void
  setCompetitionId: (id: number) => void
  setApiKey: (key: string) => void
  setTeamColor: (color: string) => void
}
