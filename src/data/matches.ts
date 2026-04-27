export interface Team {
  name: string
  shortName: string
  score: number
}

export interface Match {
  id: string
  teamA: Team
  teamB: Team
  event: string
  stage: string
  status: 'live' | 'upcoming' | 'finished'
  time: string
}

export const mockMatches: Match[] = [
  {
    id: '1',
    teamA: { name: 'Sentinels',         shortName: 'SEN', score: 2 },
    teamB: { name: 'Cloud9',            shortName: 'C9',  score: 1 },
    event: 'VCT Americas 2025',
    stage: 'Stage 1 — Week 3',
    status: 'live',
    time: 'AO VIVO',
  },
  {
    id: '2',
    teamA: { name: 'LOUD',              shortName: 'LOUD', score: 0 },
    teamB: { name: 'NRG Esports',       shortName: 'NRG',  score: 0 },
    event: 'VCT Americas 2025',
    stage: 'Stage 1 — Week 3',
    status: 'upcoming',
    time: '21:00 BRT',
  },
  {
    id: '3',
    teamA: { name: 'Team Liquid',       shortName: 'TL',   score: 2 },
    teamB: { name: 'Fnatic',            shortName: 'FNC',  score: 0 },
    event: 'VCT EMEA 2025',
    stage: 'Stage 1 — Week 2',
    status: 'finished',
    time: 'Encerrado',
  },
  {
    id: '4',
    teamA: { name: 'Paper Rex',         shortName: 'PRX',  score: 1 },
    teamB: { name: 'ZETA DIVISION',     shortName: 'ZETA', score: 2 },
    event: 'VCT Pacific 2025',
    stage: 'Stage 1 — Week 2',
    status: 'finished',
    time: 'Encerrado',
  },
]
