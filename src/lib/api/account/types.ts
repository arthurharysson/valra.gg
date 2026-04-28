export interface GetAccountRequest {
  name: string
  tag: string
}

export interface AccountCard {
  small: string
  large: string
  wide: string
  id: string
}

export interface AccountInfo {
  puuid: string
  region: string
  account_level: number
  name: string
  tag: string
  card: AccountCard
  last_update: string
  last_update_raw: number
}

export interface AccountApiResponse {
  status: number
  data: AccountInfo
}
