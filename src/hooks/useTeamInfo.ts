import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '../lib/api'
import { useTeam } from '../context/TeamContext'
import type { TeamInfo } from '../types'

export function useTeamInfo() {
  const { apiKey, teamId } = useTeam()
  return useQuery<TeamInfo, Error>({
    queryKey: ['teamInfo', teamId],
    queryFn: () => createApiClient(apiKey).getTeamInfo(teamId!),
    enabled: !!apiKey && !!teamId,
  })
}
