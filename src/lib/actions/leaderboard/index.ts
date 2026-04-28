import { getLeaderboard } from '@/lib/api/leaderboard'

import { GetLeaderboardRequest, GetLeaderboardResponse } from '@/lib/api/leaderboard/types'

// Lista o leaderboard de uma região com filtros opcionais
export async function listLeaderboard(
  params: GetLeaderboardRequest
): Promise<GetLeaderboardResponse> {
  return getLeaderboard(params)
}
