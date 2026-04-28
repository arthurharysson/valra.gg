export type LeaderboardRegion = 'eu' | 'na' | 'latam' | 'br' | 'ap' | 'kr'

export type LeaderboardSeason =
  | 'e1a1' | 'e1a2' | 'e1a3'
  | 'e2a1' | 'e2a2' | 'e2a3'
  | 'e3a1' | 'e3a2' | 'e3a3'
  | 'e4a1' | 'e4a2' | 'e4a3'
  | 'e5a1' | 'e5a2' | 'e5a3'
  | 'e6a1' | 'e6a2' | 'e6a3'
  | 'e7a1' | 'e7a2' | 'e7a3'
  | 'e8a1' | 'e8a2' | 'e8a3'
  | 'e9a1' | 'e9a2' | 'e9a3'

export interface GetLeaderboardRequest {
  region: LeaderboardRegion
  season?: LeaderboardSeason
  puuid?: string
  name?: string
  tag?: string
}

export interface LeaderboardPlayer {
  PlayerCardID: string
  TitleID: string
  IsBanned: boolean
  IsAnonymized: boolean
  puuid: string
  gameName: string
  tagLine: string
  leaderboardRank: number
  rankedRating: number
  numberOfWins: number
  competitiveTier: number
}

export type GetLeaderboardResponse = LeaderboardPlayer[]
