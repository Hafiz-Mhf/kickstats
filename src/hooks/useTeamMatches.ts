import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '../lib/api'
import { useTeam } from '../context/TeamContext'
import type { Match } from '../types'

export function useTeamMatches(season: number = 2024) {
  const { apiKey, teamId } = useTeam()
  return useQuery<Match[], Error>({
    queryKey: ['teamMatches', teamId, season],
    queryFn: () => createApiClient(apiKey).getTeamMatches(teamId!, season),
    enabled: !!apiKey && !!teamId,
  })
}
