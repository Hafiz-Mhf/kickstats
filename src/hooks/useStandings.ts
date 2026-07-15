import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '../lib/api'
import { useTeam } from '../context/TeamContext'
import type { StandingRow } from '../types'

interface StandingsResponse {
  stage: string
  type: string
  table: StandingRow[]
}

export function useStandings(season: number = 2024) {
  const { apiKey, competitionId } = useTeam()
  return useQuery<StandingsResponse[], Error>({
    queryKey: ['standings', competitionId, season],
    queryFn: async () => {
      const data = await createApiClient(apiKey).getStandings(competitionId!, season)
      return data.standings
    },
    enabled: !!apiKey && !!competitionId,
  })
}
