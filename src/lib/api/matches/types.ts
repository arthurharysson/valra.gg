export interface GetMatchesRequest {
  region: string
  name: string
  tag: string
  size?: number
  mode?: string
}

export interface MatchMetadata {
  map: string
  mode: string
  mode_id: string
  matchid: string
  game_start: number
  game_start_patched: string
  game_length: number
  rounds_played: number
  queue: string
  season_id: string
  platform: string
  region: string
  cluster: string
}

export interface AgentAssets {
  small: string
  full: string
  bust: string
  killfeed: string
}

export interface CardAssets {
  small: string
  large: string
  wide: string
}

export interface PlayerAssets {
  card: CardAssets
  agent: AgentAssets
}

export interface PlayerStats {
  score: number
  kills: number
  deaths: number
  assists: number
  bodyshots: number
  headshots: number
  legshots: number
}

export interface MatchPlayer {
  puuid: string
  name: string
  tag: string
  team: string
  level: number
  character: string
  currenttier: number
  currenttier_patched: string
  player_card: string
  player_title: string
  party_id: string
  assets: PlayerAssets
  stats: PlayerStats
  damage_made: number
  damage_received: number
}

export interface TeamResult {
  has_won: boolean
  rounds_won: number
  rounds_lost: number
}

export interface Match {
  metadata: MatchMetadata
  players: {
    all_players: MatchPlayer[]
    red: MatchPlayer[]
    blue: MatchPlayer[]
  }
  teams: {
    red: TeamResult
    blue: TeamResult
  }
}

export interface MatchesApiResponse {
  status: number
  data: Match[]
}
