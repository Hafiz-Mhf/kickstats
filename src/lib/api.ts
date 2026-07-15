import type { TeamInfo, Match, Scorer, Transfer } from '../types'

const BASE = '/api'

async function apiFetch<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Auth-Token': apiKey },
  })
  if (res.status === 429) throw new Error('RATE_LIMIT')
  if (!res.ok) throw new Error(`API_ERROR:${res.status}`)
  return res.json() as Promise<T>
}

export function createApiClient(apiKey: string) {
  return {
    async getTeamInfo(teamId: number): Promise<TeamInfo> {
      return apiFetch<TeamInfo>(`/teams/${teamId}`, apiKey)
    },
    async getTeamMatches(teamId: number, season: number): Promise<Match[]> {
      const data = await apiFetch<{ matches: Match[] }>(
        `/teams/${teamId}/matches?season=${season}&limit=50`, apiKey
      )
      return data.matches
    },
    async getTopScorers(competitionId: number, season: number): Promise<Scorer[]> {
      const data = await apiFetch<{ scorers: Scorer[] }>(
        `/competitions/${competitionId}/scorers?season=${season}&limit=20`, apiKey
      )
      return data.scorers
    },
    async getTeamTransfers(teamId: number): Promise<Transfer[]> {
      const data = await apiFetch<{ transfers: Transfer[] }>(
        `/teams/${teamId}/transfers`, apiKey
      )
      return data.transfers
    },
    async validateKey(): Promise<boolean> {
      try {
        await apiFetch('/competitions/PL', apiKey)
        return true
      } catch {
        return false
      }
    },
    async getCompetitionTeams(competitionId: number): Promise<TeamInfo[]> {
      const data = await apiFetch<{ teams: TeamInfo[] }>(
        `/competitions/${competitionId}/teams`, apiKey
      )
      return data.teams
    },
    async getStandings(competitionId: number, season: number): Promise<any> {
      return apiFetch(`/competitions/${competitionId}/standings?season=${season}`, apiKey)
    },
  }
}
