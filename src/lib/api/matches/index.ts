import { fetchApi } from '@/lib/api/base'

import { GetMatchesRequest, MatchesApiResponse } from './types'

// Busca o histórico de partidas recentes do jogador
export async function getMatches(
  { region, name, tag, size = 20, mode }: GetMatchesRequest
): Promise<MatchesApiResponse> {
  const query = new URLSearchParams()
  query.set('size', String(size))
  if (mode) query.set('mode', mode)

  return fetchApi<MatchesApiResponse>(
    `/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?${query}`,
    { headers: { Authorization: process.env.NEXT_SECRET_API_KEY ?? '' } }
  )
}
