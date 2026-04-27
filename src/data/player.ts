export interface AgentStat {
  agent: string
  matches: number
  winRate: number
  kd: number
}

export interface RecentMatch {
  id: string
  agent: string
  map: string
  result: 'win' | 'loss'
  score: string
  kills: number
  deaths: number
  assists: number
  kd: number
  date: string
}

export interface PlayerStats {
  name: string
  tag: string
  region: string
  rank: { tier: string; division: string; rr: number }
  peakRank: { tier: string; division: string }
  kd: number
  winRate: number
  headshotRate: number
  matchesPlayed: number
  topAgents: AgentStat[]
  recentMatches: RecentMatch[]
}

export const mockPlayer: PlayerStats = {
  name: 'Valra',
  tag: 'GG',
  region: 'BR',
  rank: { tier: 'Immortal', division: '3', rr: 78 },
  peakRank: { tier: 'Radiant', division: '' },
  kd: 1.42,
  winRate: 56.3,
  headshotRate: 28.7,
  matchesPlayed: 342,
  topAgents: [
    { agent: 'Jett',    matches: 98,  winRate: 60.2, kd: 1.71 },
    { agent: 'Reyna',   matches: 74,  winRate: 54.1, kd: 1.55 },
    { agent: 'Neon',    matches: 52,  winRate: 57.7, kd: 1.38 },
  ],
  recentMatches: [
    { id: '1', agent: 'Jett',  map: 'Ascent',  result: 'win',  score: '13-8',  kills: 24, deaths: 14, assists: 4, kd: 1.71, date: '2025-04-27' },
    { id: '2', agent: 'Reyna', map: 'Bind',    result: 'loss', score: '10-13', kills: 18, deaths: 16, assists: 2, kd: 1.12, date: '2025-04-26' },
    { id: '3', agent: 'Jett',  map: 'Icebox',  result: 'win',  score: '13-5',  kills: 30, deaths: 10, assists: 6, kd: 3.00, date: '2025-04-26' },
    { id: '4', agent: 'Neon',  map: 'Pearl',   result: 'loss', score: '11-13', kills: 20, deaths: 19, assists: 7, kd: 1.05, date: '2025-04-25' },
    { id: '5', agent: 'Jett',  map: 'Haven',   result: 'win',  score: '13-10', kills: 22, deaths: 15, assists: 3, kd: 1.47, date: '2025-04-25' },
  ],
}
