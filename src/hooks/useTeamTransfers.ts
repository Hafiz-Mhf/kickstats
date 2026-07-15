import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '../lib/api'
import { useTeam } from '../context/TeamContext'
import type { Transfer } from '../types'

const CURRENT_SEASON = '2025'

export function useTeamTransfers() {
  const { apiKey, teamId } = useTeam()
  return useQuery<Transfer[], Error>({
    queryKey: ['teamTransfers', teamId],
    queryFn: async () => {
      const all = await createApiClient(apiKey).getTeamTransfers(teamId!)
      return all.filter(t => t.season === CURRENT_SEASON)
    },
    enabled: !!apiKey && !!teamId,
  })
}
