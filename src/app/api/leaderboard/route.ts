import { NextRequest, NextResponse } from 'next/server'

import { listLeaderboard } from '@/lib/actions/leaderboard'
import type { LeaderboardRegion, LeaderboardSeason } from '@/lib/api/leaderboard/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const region = (searchParams.get('region') ?? 'na') as LeaderboardRegion
    const season = (searchParams.get('season') ?? undefined) as LeaderboardSeason | undefined

    const data = await listLeaderboard({ region, season })

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar leaderboard'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
