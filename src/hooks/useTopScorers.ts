import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '../lib/api'
import { useTeam } from '../context/TeamContext'
import type { Scorer } from '../types'

export function useTopScorers(season: number = 2024) {
  const { apiKey, competitionId } = useTeam()
  return useQuery<Scorer[], Error>({
    queryKey: ['topScorers', competitionId, season],
    queryFn: () => createApiClient(apiKey).getTopScorers(competitionId!, season),
    enabled: !!apiKey && !!competitionId,
  })
}
