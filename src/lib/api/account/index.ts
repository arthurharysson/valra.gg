import { fetchApi } from '@/lib/api/base'

import { AccountApiResponse, GetAccountRequest } from './types'

// Busca informações da conta pelo nome e tag
export async function getAccount(
  { name, tag }: GetAccountRequest
): Promise<AccountApiResponse> {
  return fetchApi<AccountApiResponse>(
    `/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
    { headers: { Authorization: process.env.NEXT_SECRET_API_KEY ?? '' } }
  )
}
