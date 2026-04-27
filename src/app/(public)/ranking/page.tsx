'use client'

import { useState } from 'react'
import { Gamepad2, Monitor } from 'lucide-react'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Table } from '@/components/ui/Table'
import { HeadLine } from '@/components/ui/HeadLine'
import { Tabs } from '@/components/ui/Tabs'
import { FilterModal } from '@/components/ui/FilterModal'
import { RankBadge } from '@/components/ui/RankBadge'
import { mockRanking, type RankedPlayer } from '@/data/ranking'
import type { FilterCategory } from '@/components/ui/FilterModal/types'

// ── Dados de filtro ───────────────────────────────────────────────────────────

const filterCategories: FilterCategory[] = [
  {
    id: 'platform',
    label: 'Plataforma',
    options: [
      { id: 'pc',      label: 'PC'      },
      { id: 'console', label: 'Console' },
    ],
  },
  {
    id: 'region',
    label: 'Região',
    options: [
      { id: 'global', label: 'Global'         },
      { id: 'latam',  label: 'Latin America'  },
      { id: 'na',     label: 'North America'  },
      { id: 'eu',     label: 'Europe'         },
      { id: 'apac',   label: 'APAC'           },
      { id: 'br',     label: 'Brasil'         },
      { id: 'kr',     label: 'Korea'          },
      { id: 'jp',     label: 'Japan'          },
    ],
  },
  {
    id: 'season',
    label: 'Temporada',
    groups: [
      {
        label: 'Episódio 5',
        options: [
          { id: 'e5a1', label: 'Episódio 5: Ato I'   },
          { id: 'e5a2', label: 'Episódio 5: Ato II'  },
          { id: 'e5a3', label: 'Episódio 5: Ato III' },
        ],
      },
      {
        label: 'Episódio 6',
        options: [
          { id: 'e6a1', label: 'Episódio 6: Ato I'   },
          { id: 'e6a2', label: 'Episódio 6: Ato II'  },
          { id: 'e6a3', label: 'Episódio 6: Ato III' },
        ],
      },
      {
        label: 'Episódio 7',
        options: [
          { id: 'e7a1', label: 'Episódio 7: Ato I'   },
          { id: 'e7a2', label: 'Episódio 7: Ato II'  },
          { id: 'e7a3', label: 'Episódio 7: Ato III' },
        ],
      },
      {
        label: 'Episódio 8',
        options: [
          { id: 'e8a1', label: 'Episódio 8: Ato I'   },
          { id: 'e8a2', label: 'Episódio 8: Ato II'  },
          { id: 'e8a3', label: 'Episódio 8: Ato III' },
        ],
      },
      {
        label: 'V26',
        options: [
          { id: 'v26a1', label: 'V26: Ato I'  },
          { id: 'v26a2', label: 'V26: Ato II' },
        ],
      },
    ],
  },
  {
    id: 'countries',
    label: 'Países',
    options: [
      { id: 'all', label: 'Todos os Países'  },
      { id: 'br',  label: 'Brasil'           },
      { id: 'us',  label: 'EUA'              },
      { id: 'ca',  label: 'Canadá'           },
      { id: 'tr',  label: 'Turquia'          },
      { id: 'fi',  label: 'Finlândia'        },
      { id: 'ru',  label: 'Rússia'           },
      { id: 'kr',  label: 'Coreia do Sul'    },
      { id: 'gb',  label: 'Reino Unido'      },
      { id: 'be',  label: 'Bélgica'          },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_LABELS: Record<string, string> = {
  platform: 'PC',
  region:   'Latin America',
  season:   'V26: Ato II',
  countries:'All Countries',
}

function getTabLabel(categoryId: string, values: Record<string, string[]>): string {
  const selected = values[categoryId] ?? []
  if (selected.length === 0) return DEFAULT_LABELS[categoryId]
  const cat = filterCategories.find(c => c.id === categoryId)
  if (!cat) return DEFAULT_LABELS[categoryId]
  const allOptions = cat.options ?? cat.groups?.flatMap(g => g.options) ?? []
  const first = allOptions.find(o => o.id === selected[0])
  if (!first) return DEFAULT_LABELS[categoryId]
  return selected.length > 1 ? `${first.label} +${selected.length - 1}` : first.label
}

// ── Células da tabela ─────────────────────────────────────────────────────────

function PlaceCell({ place }: { place: number }) {
  return (
    <div className="flex items-center justify-center">
      <RankBadge place={place} variant="outline" size="md" />
    </div>
  )
}

function PlayerCell({ name, tag }: { name: string; tag: string }) {
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

function FlagCell({ countryCode, country }: { countryCode: string; country: string }) {
  return (
    <div className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w40/${countryCode}.png`}
        alt={country} title={country}
        width={36} height={26}
        className="rounded object-cover"
        style={{ width: 36, height: 26 }}
      />
    </div>
  )
}

function ChangeCell({ change }: { change: number }) {
  if (change === 0) return <div className="flex items-center justify-center gap-1 text-gray-600"><Minus size={13} /></div>
  if (change > 0) return (
    <div className="flex items-center justify-center gap-1 text-emerald-400 font-medium">
      <span className="text-xs">{change}</span><ArrowUp size={13} />
    </div>
  )
  return (
    <div className="flex items-center justify-center gap-1 text-[#FF4655] font-medium">
      <span className="text-xs">{Math.abs(change)}</span><ArrowDown size={13} />
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
    Header: 'Pos', accessor: 'place' as keyof RankedPlayer,
    align: 'center' as const, tdClassName: 'w-16', thClassName: 'w-16',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => <PlaceCell place={row.place} />,
  },
  {
    Header: 'Jogador', accessor: 'name' as keyof RankedPlayer,
    tdClassName: 'w-[130px] max-w-[130px]',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => <PlayerCell name={row.name} tag={row.tag} />,
  },
  {
    Header: 'País', accessor: 'countryCode' as keyof RankedPlayer,
    align: 'center' as const, tdClassName: 'w-32',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => <FlagCell countryCode={row.countryCode} country={row.country} />,
  },
  {
    Header: 'Últimas 24h', accessor: 'change' as keyof RankedPlayer,
    align: 'center' as const, tdClassName: 'w-36',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => <ChangeCell change={row.change} />,
  },
  {
    Header: 'Rating', accessor: 'rr' as keyof RankedPlayer,
    align: 'right' as const, tdClassName: 'w-64',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => <RRCell rr={row.rr} />,
  },
  {
    Header: 'Tier', accessor: 'tier' as keyof RankedPlayer, tdClassName: 'w-36',
    format: (value: RankedPlayer[keyof RankedPlayer]) => (
      <span className="text-[#FF4655] font-semibold text-xs uppercase tracking-wide">{value as string}</span>
    ),
  },
  {
    Header: 'Vitórias', accessor: 'wins' as keyof RankedPlayer,
    align: 'right' as const, tdClassName: 'w-32',
    format: (value: RankedPlayer[keyof RankedPlayer]) => (
      <span className="text-white font-semibold tabular-nums">{value as number}</span>
    ),
  },
]

// ── Página ────────────────────────────────────────────────────────────────────

const TAB_IDS = ['platform', 'region', 'season', 'countries']

export default function RankingPage() {
  const [modalOpen, setModalOpen]         = useState(false)
  const [modalCategory, setModalCategory] = useState('platform')
  const [filterValues, setFilterValues]   = useState<Record<string, string[]>>({
    platform: ['pc'],
    region:   ['latam'],
    season:   ['v26a2'],
    countries:['all'],
  })

  const openModal = (categoryId: string) => {
    setModalCategory(categoryId)
    setModalOpen(true)
  }

  const handleChange = (categoryId: string, selected: string[]) => {
    setFilterValues(prev => ({ ...prev, [categoryId]: selected }))
  }

  const handleReset = () => {
    setFilterValues({ platform: [], region: [], season: [], countries: [] })
  }

  const platformIcon = (filterValues.platform ?? [])[0] === 'console' ? Gamepad2 : Monitor

  const filterTabs = [
    { id: 'platform',  label: getTabLabel('platform',  filterValues), icon: platformIcon, onOptions: openModal },
    { id: 'region',    label: getTabLabel('region',    filterValues),                onOptions: openModal },
    { id: 'season',    label: getTabLabel('season',    filterValues),                onOptions: openModal },
    { id: 'countries', label: getTabLabel('countries', filterValues),                onOptions: openModal },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">

      <div className="flex flex-col gap-1">
        <HeadLine text="TABELA DE CLASSIFICAÇÃO / RANK GLOBAL V26 - ATO II" />
        <p className="text-sm text-gray-500 ml-3">Atualizado a 5 minutos atrás</p>
      </div>

      <Tabs
        items={filterTabs}
        value=""
        onChange={() => {}}
        variant="filled"
        color="red"
        multiActive={TAB_IDS}
      />

      <Table<RankedPlayer>
        columns={columns}
        data={mockRanking}
        itemsPerPage={15}
        size="lg"
        getRowClassName={(row: RankedPlayer, index: number) => {
          if (row.place === 1) return 'bg-yellow-500/[0.07]'
          if (row.place === 2) return 'bg-gray-400/[0.05]'
          if (row.place === 3) return 'bg-orange-700/[0.07]'
          return index % 2 !== 0 ? 'bg-white/[0.02]' : ''
        }}
      />

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
