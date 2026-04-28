'use client'

import { useEffect, useState } from 'react'
import { Table } from '@/components/ui/Table'
import { HeadLine } from '@/components/ui/HeadLine'
import { Tabs } from '@/components/ui/Tabs'
import { FilterModal } from '@/components/ui/FilterModal'
import { RankBadge } from '@/components/ui/RankBadge'
import type { FilterCategory } from '@/components/ui/FilterModal/types'
import type { LeaderboardPlayer, LeaderboardRegion, LeaderboardSeason } from '@/lib/api/leaderboard/types'

// ── Dados de filtro ───────────────────────────────────────────────────────────

const filterCategories: FilterCategory[] = [
  {
    id: 'region',
    label: 'Região',
    options: [
      { id: 'eu',    label: 'Europe'        },
      { id: 'na',    label: 'North America' },
      { id: 'latam', label: 'Latin America' },
      { id: 'br',    label: 'Brasil'        },
      { id: 'ap',    label: 'APAC'          },
      { id: 'kr',    label: 'Korea'         },
    ],
  },
  {
    id: 'season',
    label: 'Temporada',
    groups: [
      { label: 'Episódio 1', options: [{ id: 'e1a1', label: 'Ato I' }, { id: 'e1a2', label: 'Ato II' }, { id: 'e1a3', label: 'Ato III' }] },
      { label: 'Episódio 2', options: [{ id: 'e2a1', label: 'Ato I' }, { id: 'e2a2', label: 'Ato II' }, { id: 'e2a3', label: 'Ato III' }] },
      { label: 'Episódio 3', options: [{ id: 'e3a1', label: 'Ato I' }, { id: 'e3a2', label: 'Ato II' }, { id: 'e3a3', label: 'Ato III' }] },
      { label: 'Episódio 4', options: [{ id: 'e4a1', label: 'Ato I' }, { id: 'e4a2', label: 'Ato II' }, { id: 'e4a3', label: 'Ato III' }] },
      { label: 'Episódio 5', options: [{ id: 'e5a1', label: 'Ato I' }, { id: 'e5a2', label: 'Ato II' }, { id: 'e5a3', label: 'Ato III' }] },
      { label: 'Episódio 6', options: [{ id: 'e6a1', label: 'Ato I' }, { id: 'e6a2', label: 'Ato II' }, { id: 'e6a3', label: 'Ato III' }] },
      { label: 'Episódio 7', options: [{ id: 'e7a1', label: 'Ato I' }, { id: 'e7a2', label: 'Ato II' }, { id: 'e7a3', label: 'Ato III' }] },
      { label: 'Episódio 8', options: [{ id: 'e8a1', label: 'Ato I' }, { id: 'e8a2', label: 'Ato II' }, { id: 'e8a3', label: 'Ato III' }] },
      { label: 'Episódio 9', options: [{ id: 'e9a1', label: 'Ato I' }, { id: 'e9a2', label: 'Ato II' }, { id: 'e9a3', label: 'Ato III' }] },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const REGION_LABELS: Record<string, string> = {
  eu: 'Europe', na: 'North America', latam: 'Latin America', br: 'Brasil', ap: 'APAC', kr: 'Korea',
}

function getSeasonLabel(id: string): string {
  const match = id.match(/^e(\d+)a(\d+)$/)
  if (!match) return id
  const acts: Record<string, string> = { '1': 'Ato I', '2': 'Ato II', '3': 'Ato III' }
  return `Ep.${match[1]} ${acts[match[2]] ?? match[2]}`
}

function getTabLabel(categoryId: string, values: Record<string, string[]>): string {
  const [selected] = values[categoryId] ?? []
  if (!selected) return categoryId === 'region' ? 'North America' : 'Atual'
  return categoryId === 'season' ? getSeasonLabel(selected) : (REGION_LABELS[selected] ?? selected)
}

// ── Células da tabela ─────────────────────────────────────────────────────────

function PlaceCell({ place }: { place: number }) {
  return (
    <div className="flex items-center justify-center">
      <RankBadge place={place} variant="outline" size="md" />
    </div>
  )
}

function PlayerCell({ name, tag, anonymized }: { name: string; tag: string; anonymized: boolean }) {
  if (anonymized) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/[0.06] shrink-0" />
        <span className="text-gray-600 font-semibold">—</span>
      </div>
    )
  }
  const initials = name.slice(0, 2).toUpperCase()
  const hue = (name.charCodeAt(0) * 17) % 360
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
        style={{ backgroundColor: `hsl(${hue}, 45%, 28%)` }}
      >
        {initials}
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-white font-semibold truncate">{name}</span>
        <span className="text-gray-600 text-xs shrink-0 bg-white/[0.06] px-1.5 py-0.5 rounded">#{tag}</span>
      </div>
    </div>
  )
}

function RRCell({ rr }: { rr: number }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/icons/radiant-ico.webp" alt="Radiant" width={28} height={28} className="shrink-0 object-contain" />
      <span className="text-white font-semibold tabular-nums">{rr}</span>
    </div>
  )
}

// ── Colunas ───────────────────────────────────────────────────────────────────

const columns = [
  {
    Header: 'Pos', accessor: 'leaderboardRank' as keyof LeaderboardPlayer,
    align: 'center' as const, tdClassName: 'w-16', thClassName: 'w-16',
    format: (_: LeaderboardPlayer[keyof LeaderboardPlayer], row: LeaderboardPlayer) =>
      <PlaceCell place={row.leaderboardRank} />,
  },
  {
    Header: 'Jogador', accessor: 'gameName' as keyof LeaderboardPlayer,
    tdClassName: 'w-[200px] max-w-[200px]',
    format: (_: LeaderboardPlayer[keyof LeaderboardPlayer], row: LeaderboardPlayer) =>
      <PlayerCell name={row.gameName} tag={row.tagLine} anonymized={row.IsAnonymized} />,
  },
  {
    Header: 'Rating', accessor: 'rankedRating' as keyof LeaderboardPlayer,
    align: 'right' as const, tdClassName: 'w-64',
    format: (_: LeaderboardPlayer[keyof LeaderboardPlayer], row: LeaderboardPlayer) =>
      <RRCell rr={row.rankedRating} />,
  },
  {
    Header: 'Vitórias', accessor: 'numberOfWins' as keyof LeaderboardPlayer,
    align: 'right' as const, tdClassName: 'w-32',
    format: (value: LeaderboardPlayer[keyof LeaderboardPlayer]) => (
      <span className="text-white font-semibold tabular-nums">{value as number}</span>
    ),
  },
]

// ── Página ────────────────────────────────────────────────────────────────────

const TAB_IDS = ['region', 'season']

export default function RankingPage() {
  const [modalOpen, setModalOpen]         = useState(false)
  const [modalCategory, setModalCategory] = useState('region')
  const [filterValues, setFilterValues]   = useState<Record<string, string[]>>({
    region: ['br'],
    season: [],
  })
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [loading, setLoading] = useState(true)

  const region = (filterValues.region[0] ?? 'na') as LeaderboardRegion
  const season = filterValues.season[0] as LeaderboardSeason | undefined

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ region })
    if (season) params.set('season', season)

    fetch(`/api/leaderboard?${params}`)
      .then(r => r.json())
      .then(setPlayers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [region, season])

  const openModal = (categoryId: string) => {
    setModalCategory(categoryId)
    setModalOpen(true)
  }

  const handleChange = (categoryId: string, selected: string[]) => {
    // single-select: mantém apenas o último item selecionado
    const last = selected.at(-1)
    setFilterValues(prev => ({ ...prev, [categoryId]: last ? [last] : [] }))
  }

  const handleReset = () => {
    setFilterValues({ region: ['br'], season: [] })
  }

  const filterTabs = [
    { id: 'region', label: getTabLabel('region', filterValues), onOptions: openModal },
    { id: 'season', label: getTabLabel('season', filterValues), onOptions: openModal },
  ]

  const seasonLabel = season ? getSeasonLabel(season) : 'Atual'
  const headline = `CLASSIFICAÇÃO / ${REGION_LABELS[region] ?? region} — ${seasonLabel}`.toUpperCase()

  return (
    <div className="flex flex-col gap-6 p-6">

      <div className="flex flex-col gap-1">
        <HeadLine text={headline} />
        {!loading && (
          <p className="text-sm text-gray-500 ml-3">{players.length} jogadores carregados</p>
        )}
      </div>

      <Tabs
        items={filterTabs}
        value=""
        onChange={() => {}}
        variant="filled"
        color="red"
        multiActive={TAB_IDS}
      />

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-500 text-sm">
          Carregando...
        </div>
      ) : (
        <Table<LeaderboardPlayer>
          columns={columns}
          data={players}
          itemsPerPage={15}
          size="lg"
          getRowClassName={(_: LeaderboardPlayer, index: number) =>
            index % 2 !== 0 ? 'bg-white/[0.02]' : ''
          }
        />
      )}

      <FilterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={filterCategories}
        values={filterValues}
        onChange={handleChange}
        onReset={handleReset}
        onSave={() => setModalOpen(false)}
        initialCategory={modalCategory}
      />
    </div>
  )
}
