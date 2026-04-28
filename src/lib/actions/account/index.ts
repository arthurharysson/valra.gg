import { getAccount } from '@/lib/api/account'

import { AccountInfo, GetAccountRequest } from '@/lib/api/account/types'

// Encontra e retorna os dados da conta de um jogador
export async function findAccount(params: GetAccountRequest): Promise<AccountInfo> {
  const response = await getAccount(params)
  return response.data
}
