'use client'

import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Table } from '@/components/ui/Table'
import { mockRanking, type RankedPlayer } from '@/data/ranking'

// ── Célula: Posição ──────────────────────────────────────────────────────────

function PlaceCell({ place }: { place: number }) {
  if (place === 1) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-yellow-500/20 border border-yellow-500/30">
          <span className="text-yellow-400 font-black text-base">{place}</span>
        </div>
      </div>
    )
  }
  if (place === 2) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-400/15 border border-gray-400/25">
          <span className="text-gray-300 font-black text-base">{place}</span>
        </div>
      </div>
    )
  }
  if (place === 3) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-700/20 border border-orange-700/30">
          <span className="text-orange-400 font-black text-base">{place}</span>
        </div>
      </div>
    )
  }
  return <span className="text-gray-500 font-medium">{place}</span>
}

// ── Célula: Jogador ──────────────────────────────────────────────────────────

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

// ── Célula: Bandeira ─────────────────────────────────────────────────────────

function FlagCell({ countryCode, country }: { countryCode: string; country: string }) {
  return (
    <div className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w40/${countryCode}.png`}
        alt={country}
        title={country}
        width={36}
        height={26}
        className="rounded object-cover"
        style={{ width: 36, height: 26 }}
      />
    </div>
  )
}

// ── Célula: Variação 24h ─────────────────────────────────────────────────────

function ChangeCell({ change }: { change: number }) {
  if (change === 0) {
    return (
      <div className="flex items-center justify-center gap-1 text-gray-600">
        <Minus size={13} />
      </div>
    )
  }
  if (change > 0) {
    return (
      <div className="flex items-center justify-center gap-1 text-emerald-400 font-medium">
        <span className="text-xs">{change}</span>
        <ArrowUp size={13} />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center gap-1 text-[#FF4655] font-medium">
      <span className="text-xs">{Math.abs(change)}</span>
      <ArrowDown size={13} />
    </div>
  )
}

// ── Célula: RR ───────────────────────────────────────────────────────────────

function RRCell({ rr }: { rr: number }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/icons/radiant-ico.webp"
        alt="Radiant"
        width={28}
        height={28}
        className="shrink-0 object-contain"
      />
      <span className="text-white font-semibold tabular-nums">{rr}</span>
    </div>
  )
}

// ── Colunas ──────────────────────────────────────────────────────────────────

const columns = [
  {
    Header: 'Pos',
    accessor: 'place' as keyof RankedPlayer,
    align: 'center' as const,
    tdClassName: 'w-16',
    thClassName: 'w-16',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => (
      <PlaceCell place={row.place} />
    ),
  },
  {
    Header: 'Jogador',
    accessor: 'name' as keyof RankedPlayer,
    tdClassName: 'w-[130px] max-w-[130px]',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => (
      <PlayerCell name={row.name} tag={row.tag} />
    ),
  },
  {
    Header: 'País',
    accessor: 'countryCode' as keyof RankedPlayer,
    align: 'center' as const,
    tdClassName: 'w-32',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => (
      <FlagCell countryCode={row.countryCode} country={row.country} />
    ),
  },
  {
    Header: 'Últimas 24h',
    accessor: 'change' as keyof RankedPlayer,
    align: 'center' as const,
    tdClassName: 'w-36',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => (
      <ChangeCell change={row.change} />
    ),
  },
  {
    Header: 'Rating',
    accessor: 'rr' as keyof RankedPlayer,
    align: 'right' as const,
    tdClassName: 'w-64',
    format: (_: RankedPlayer[keyof RankedPlayer], row: RankedPlayer) => (
      <RRCell rr={row.rr} />
    ),
  },
  {
    Header: 'Tier',
    accessor: 'tier' as keyof RankedPlayer,
    tdClassName: 'w-36',
    format: (value: RankedPlayer[keyof RankedPlayer]) => (
      <span className="text-[#FF4655] font-semibold text-xs uppercase tracking-wide">
        {value as string}
      </span>
    ),
  },
  {
    Header: 'Vitórias',
    accessor: 'wins' as keyof RankedPlayer,
    align: 'right' as const,
    tdClassName: 'w-32',
    format: (value: RankedPlayer[keyof RankedPlayer]) => (
      <span className="text-white font-semibold tabular-nums">{value as number}</span>
    ),
  },
]

// ── Página ───────────────────────────────────────────────────────────────────

export default function RankingPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-[#FF4655]" />
          <h1 className="text-2xl font-bold text-white tracking-tight"> TABELA DE CLASSIFICAÇÃO / RANK GLOBAL V26 - ATO II</h1>
        </div>
        <p className="text-sm text-gray-500 ml-3">
          Melhores jogadores do servidor — atualizado em tempo real
        </p>
      </div>

      <div className="flex items-center gap-2">
        {['Global', 'BR', 'NA', 'EU', 'APAC'].map((region) => (
          <button
            key={region}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              region === 'Global'
                ? 'bg-[#FF4655]/15 text-[#FF4655] border border-[#FF4655]/25'
                : 'text-gray-500 border border-white/[0.08] hover:border-white/[0.15] hover:text-gray-300'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <Table<RankedPlayer>
        columns={columns}
        data={mockRanking}
        itemsPerPage={15}
        size="lg"
      />
    </div>
  )
}
