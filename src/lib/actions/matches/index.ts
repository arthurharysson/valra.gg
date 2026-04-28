import { getMatches } from '@/lib/api/matches'

import { GetMatchesRequest, Match, MatchPlayer } from '@/lib/api/matches/types'

export async function listMatches(params: GetMatchesRequest): Promise<Match[]> {
  const response = await getMatches(params)
  return response.data
}

export interface ComputedStats {
  acs: number
  adr: number
  kd: string
  kad: string
  kpr: string
  winRate: number
  hsRate: number
  ddDelta: number
  kills: number
  deaths: number
  assists: number
  wins: number
  total: number
  totalRounds: number
}

export function computePlayerStats(matches: Match[], puuid: string): ComputedStats {
  let kills = 0, deaths = 0, assists = 0
  let headshots = 0, bodyshots = 0, legshots = 0
  let score = 0, rounds = 0, damageMade = 0, damageReceived = 0
  let wins = 0

  for (const match of matches) {
    const player: MatchPlayer | undefined = match.players.all_players.find(p => p.puuid === puuid)
    if (!player) continue
    const team = match.teams[player.team.toLowerCase() as 'red' | 'blue']
    if (team?.has_won) wins++
    kills          += player.stats.kills
    deaths         += player.stats.deaths
    assists        += player.stats.assists
    headshots      += player.stats.headshots
    bodyshots      += player.stats.bodyshots
    legshots       += player.stats.legshots
    score          += player.stats.score
    rounds         += match.metadata.rounds_played
    damageMade     += player.damage_made
    damageReceived += player.damage_received
  }

  const total = matches.length
  const shots = headshots + bodyshots + legshots

  return {
    acs:     rounds > 0 ? Math.round(score / rounds)                        : 0,
    adr:     rounds > 0 ? Math.round(damageMade / rounds)                   : 0,
    kd:      deaths > 0 ? (kills / deaths).toFixed(2)                       : kills.toFixed(2),
    kad:     deaths > 0 ? ((kills + assists) / deaths).toFixed(2)           : (kills + assists).toFixed(2),
    kpr:     rounds > 0 ? (kills / rounds).toFixed(2)                       : '0.00',
    winRate: total  > 0 ? Math.round((wins / total) * 100)                  : 0,
    hsRate:  shots  > 0 ? Math.round((headshots / shots) * 100)             : 0,
    ddDelta: rounds > 0 ? Math.round((damageMade - damageReceived) / rounds): 0,
    kills, deaths, assists, wins, total, totalRounds: rounds,
  }
}
