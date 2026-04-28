import { fetchApi } from '@/lib/api/base'

import { GetLeaderboardRequest, GetLeaderboardResponse } from './types'

// Retorna o ranking dos melhores jogadores de uma região
export async function getLeaderboard(
  params: GetLeaderboardRequest
): Promise<GetLeaderboardResponse> {
  const { region, season, puuid, name, tag } = params

  const query = new URLSearchParams()
  if (season) query.set('season', season)
  if (puuid) query.set('puuid', puuid)
  if (name)  query.set('name', name)
  if (tag)   query.set('tag', tag)

  const qs  = query.toString()
  const path = `/valorant/v1/leaderboard/${region}${qs ? `?${qs}` : ''}`

  return fetchApi<GetLeaderboardResponse>(path, {
    headers: { Authorization: process.env.NEXT_SECRET_API_KEY ?? '' },
  })
}
