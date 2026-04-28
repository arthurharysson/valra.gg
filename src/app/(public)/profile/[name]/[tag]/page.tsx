import Image from 'next/image'
import { findAccount } from '@/lib/actions/account'
import { computePlayerStats, listMatches } from '@/lib/actions/matches'
import type { ComputedStats } from '@/lib/actions/matches'
import type { Match, MatchPlayer } from '@/lib/api/matches/types'
import type { AccountInfo } from '@/lib/api/account/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(unix: number): string {
  const diff = Date.now() - unix * 1000
  const m = Math.floor(diff / 60_000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d atrás`
  if (h > 0) return `${h}h atrás`
  if (m > 0) return `${m}m atrás`
  return 'agora'
}

function tierColor(p: string): string {
  if (p.startsWith('Bronze'))    return '#CD7F32'
  if (p.startsWith('Silver'))    return '#C0C0C0'
  if (p.startsWith('Gold'))      return '#F0B429'
  if (p.startsWith('Platinum'))  return '#26D4D4'
  if (p.startsWith('Diamond'))   return '#B89DFF'
  if (p.startsWith('Ascendant')) return '#4AC97E'
  if (p.startsWith('Immortal'))  return '#FF4655'
  if (p.startsWith('Radiant'))   return '#FFD700'
  return '#9B8B7A'
}

function rankIcon(p: string): string {
  if (p.startsWith('Bronze'))    return '/images/icons/bronze-ico.webp'
  if (p.startsWith('Silver'))    return '/images/icons/silver-ico.webp'
  if (p.startsWith('Gold'))      return '/images/icons/gold-ico.webp'
  if (p.startsWith('Platinum'))  return '/images/icons/platinum-ico.webp'
  if (p.startsWith('Diamond'))   return '/images/icons/diamond-ico.webp'
  if (p.startsWith('Ascendant')) return '/images/icons/ascendent-ico.webp'
  if (p.startsWith('Immortal'))  return '/images/icons/immortal-ico.webp'
  if (p.startsWith('Radiant'))   return '/images/icons/radiant-ico.webp'
  return '/images/icons/iron-ico.webp'
}

function rankBase(p: string): string { return p.split(' ')[0].toUpperCase() }

function getPlayer(match: Match, puuid: string): MatchPlayer | undefined {
  return match.players.all_players.find(p => p.puuid === puuid)
}

function calcAcs(player: MatchPlayer, rounds: number) {
  return rounds > 0 ? Math.round(player.stats.score / rounds) : 0
}
function calcHs(player: MatchPlayer) {
  const t = player.stats.headshots + player.stats.bodyshots + player.stats.legshots
  return t > 0 ? Math.round((player.stats.headshots / t) * 100) : 0
}
function calcDd(player: MatchPlayer, rounds: number) {
  return rounds > 0 ? Math.round((player.damage_made - player.damage_received) / rounds) : 0
}

function formatDateKey(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

function groupByDate(matches: Match[]) {
  const map = new Map<string, Match[]>()
  for (const m of matches) {
    const key = formatDateKey(m.metadata.game_start)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(m)
  }
  return Array.from(map.entries()).map(([date, ms]) => ({ date, matches: ms }))
}

function computeTopMaps(matches: Match[], puuid: string) {
  const map = new Map<string, { wins: number; total: number }>()
  for (const m of matches) {
    const player = m.players.all_players.find(p => p.puuid === puuid)
    if (!player) continue
    const team = m.teams[player.team.toLowerCase() as 'red' | 'blue']
    const name = m.metadata.map
    if (!map.has(name)) map.set(name, { wins: 0, total: 0 })
    const s = map.get(name)!
    s.total++
    if (team?.has_won) s.wins++
  }
  return Array.from(map.entries())
    .map(([name, { wins, total }]) => ({ name, wins, losses: total - wins, total, wr: Math.round((wins / total) * 100) }))
    .sort((a, b) => b.total - a.total)
}

function computeGroupStats(matches: Match[], puuid: string) {
  let kills = 0, deaths = 0, assists = 0, headshots = 0, bodyshots = 0, legshots = 0
  let score = 0, rounds = 0, damageMade = 0, damageReceived = 0, wins = 0
  for (const m of matches) {
    const player = m.players.all_players.find(p => p.puuid === puuid)
    if (!player) continue
    const team = m.teams[player.team.toLowerCase() as 'red' | 'blue']
    if (team?.has_won) wins++
    kills += player.stats.kills; deaths += player.stats.deaths; assists += player.stats.assists
    headshots += player.stats.headshots; bodyshots += player.stats.bodyshots; legshots += player.stats.legshots
    score += player.stats.score; rounds += m.metadata.rounds_played
    damageMade += player.damage_made; damageReceived += player.damage_received
  }
  const shots = headshots + bodyshots + legshots
  return {
    wins, losses: matches.length - wins, kills, deaths, assists,
    kd:  deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2),
    kda: deaths > 0 ? ((kills + assists) / deaths).toFixed(2) : (kills + assists).toFixed(2),
    acs: rounds > 0 ? Math.round(score / rounds) : 0,
    hs:  shots  > 0 ? Math.round((headshots / shots) * 100) : 0,
    dd:  rounds > 0 ? Math.round((damageMade - damageReceived) / rounds) : 0,
  }
}

// ── UI atoms ──────────────────────────────────────────────────────────────────

function WinLossDonut({ wins, losses }: { wins: number; losses: number }) {
  const total = wins + losses
  const r = 24, circ = 2 * Math.PI * r
  const dash = total > 0 ? (wins / total) * circ : 0
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg width="56" height="56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#FF4655"  strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="#4AC97E"  strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-emerald-400 text-[9px] font-black leading-none">{wins} W</span>
        <span className="text-[#FF4655] text-[9px] font-black leading-none">{losses} L</span>
      </div>
    </div>
  )
}

function PrimaryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-[#FF4655]/50 pl-3 flex-1 min-w-0">
      <span className="text-xs font-semibold text-gray-400 truncate">{label}</span>
      <span className="text-xl font-black text-white tabular-nums">{value}</span>
    </div>
  )
}

function SecondaryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <span className="text-lg font-black text-white tabular-nums">{value}</span>
    </div>
  )
}

// ── Sidebar cards ─────────────────────────────────────────────────────────────

function RatingCard({ rank }: { rank: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-4">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Rating</p>
      <div className="flex items-center gap-3">
        <Image src={rankIcon(rank)} alt={rank} width={40} height={40} unoptimized />
        <div>
          <p className="text-[10px] text-gray-600">Rating</p>
          <p className="text-white font-black text-base leading-tight">{rank}</p>
        </div>
      </div>
      <div className="border-t border-white/[0.06] pt-3">
        <p className="text-[10px] text-gray-600 mb-2">Peak Rating</p>
        <div className="flex items-center gap-2">
          <Image src={rankIcon(rank)} alt={rank} width={28} height={28} unoptimized />
          <span className="text-gray-300 font-bold text-sm">{rank}</span>
        </div>
      </div>
    </div>
  )
}

function AccuracyCard({ stats }: { stats: ComputedStats }) {
  const bars = [
    { label: 'Head', rate: stats.hsRate, count: stats.headshotCount, color: '#FF4655' },
    { label: 'Body', rate: stats.bsRate, count: stats.bodyshotCount, color: '#6B7280' },
    { label: 'Legs', rate: stats.lsRate, count: stats.legshotCount,  color: '#374151' },
  ]
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Accuracy</p>
        <span className="text-[10px] text-gray-600">Últimas {stats.total} partidas</span>
      </div>
      {bars.map(b => (
        <div key={b.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-semibold">{b.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-black tabular-nums">{b.rate}%</span>
              <span className="text-gray-600 tabular-nums">{b.count.toLocaleString('pt-BR')} hits</span>
            </div>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${b.rate}%`, backgroundColor: b.color }} />
          </div>
        </div>
      ))}
      <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between">
        <span className="text-[11px] text-gray-600">AVG HS%</span>
        <span className="text-white font-black text-sm tabular-nums">{stats.hsRate}%</span>
      </div>
    </div>
  )
}

function TopMapsCard({ maps }: { maps: ReturnType<typeof computeTopMaps> }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-3">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Top Maps</p>
      <div className="flex flex-col gap-2">
        {maps.map(m => (
          <div key={m.name} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm truncate">{m.name}</span>
                <span className="text-white font-black text-sm tabular-nums"
                  style={{ color: m.wr >= 50 ? '#4AC97E' : '#FF4655' }}>
                  {m.wr}%
                </span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full mt-1 overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${m.wr}%`, backgroundColor: m.wr >= 50 ? '#4AC97E' : '#FF4655' }} />
              </div>
              <span className="text-gray-600 text-[10px]">{m.wins}V–{m.losses}D</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Match components ──────────────────────────────────────────────────────────

function DateGroupHeader({ date, group, puuid }: { date: string; group: Match[]; puuid: string }) {
  const s = computeGroupStats(group, puuid)
  const dd = (s.dd >= 0 ? '+' : '') + s.dd
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl">
      <span className="text-white font-black text-sm shrink-0">{date}</span>
      <span className="text-[10px] font-bold text-gray-500 bg-white/[0.07] border border-white/[0.08] px-1.5 py-0.5 rounded-md shrink-0">
        {group.length}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-emerald-400 font-bold text-xs">{s.wins} V</span>
        <span className="text-gray-600 text-[10px]">//</span>
        <span className="text-[#FF4655] font-bold text-xs">{s.losses} D</span>
      </div>
      <div className="ml-auto flex items-center gap-3 shrink-0">
        {[
          { label: 'K/D',  value: s.kd },
          { label: 'KDA',  value: s.kda },
          { label: 'DDΔ',  value: dd,  color: s.dd > 0 ? '#4AC97E' : s.dd < 0 ? '#FF4655' : undefined },
          { label: 'HS%',  value: `${s.hs}%` },
          { label: 'ACS',  value: s.acs },
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{item.label}</span>
            <span className="text-xs font-black tabular-nums" style={{ color: item.color ?? '#fff' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MatchCard({ match, puuid }: { match: Match; puuid: string }) {
  const player = getPlayer(match, puuid)
  if (!player) return null
  const team   = match.teams[player.team.toLowerCase() as 'red' | 'blue']
  const won    = team?.has_won ?? false
  const rwon   = team?.rounds_won ?? 0
  const rlost  = team?.rounds_lost ?? 0
  const rounds = match.metadata.rounds_played
  const acs    = calcAcs(player, rounds)
  const hs     = calcHs(player)
  const dd     = calcDd(player, rounds)
  const { kills, deaths, assists } = player.stats
  const kd     = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2)

  return (
    <div className={`flex items-stretch rounded-xl overflow-hidden border transition-all duration-150
      ${won ? 'border-emerald-500/20 hover:border-emerald-500/35 bg-emerald-500/[0.03]'
             : 'border-[#FF4655]/15 hover:border-[#FF4655]/28 bg-[#FF4655]/[0.02]'}`}>

      <div className={`w-[3px] shrink-0 ${won ? 'bg-emerald-500' : 'bg-[#FF4655]'}`} />

      {/* Agente */}
      <div className="relative w-[60px] h-[68px] shrink-0 overflow-hidden">
        <Image src={player.assets.agent.small} alt={player.character} fill
          className="object-cover object-top scale-110" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
      </div>

      {/* Agente + rank */}
      <div className="flex flex-col justify-center px-3 w-28 shrink-0">
        <span className="text-white font-bold text-xs leading-tight truncate">{player.character}</span>
        <span className="text-[10px] font-semibold mt-0.5" style={{ color: tierColor(player.currenttier_patched) }}>
          {player.currenttier_patched}
        </span>
        <span className="text-gray-600 text-[9px] mt-1">{relativeTime(match.metadata.game_start)}</span>
      </div>

      <div className="w-px bg-white/[0.05] self-stretch my-2 shrink-0" />

      {/* Mapa */}
      <div className="flex flex-col justify-center px-3 flex-1 min-w-0">
        <span className="text-white font-bold text-xs truncate">{match.metadata.map}</span>
        <span className="text-gray-500 text-[10px]">{match.metadata.mode}</span>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center justify-center w-20 shrink-0">
        <span className={`text-[9px] font-black uppercase tracking-widest ${won ? 'text-emerald-400' : 'text-[#FF4655]'}`}>
          {won ? 'Vitória' : 'Derrota'}
        </span>
        <span className={`text-xl font-black tabular-nums ${won ? 'text-emerald-400' : 'text-[#FF4655]'}`}>
          {rwon}<span className="text-gray-600 text-base mx-0.5">:</span>{rlost}
        </span>
      </div>

      <div className="w-px bg-white/[0.05] self-stretch my-2 shrink-0" />

      {/* K/D/A */}
      <div className="flex flex-col items-center justify-center w-24 shrink-0 px-2">
        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">K / D / A</span>
        <div className="flex items-center gap-0.5 text-sm font-bold">
          <span className="text-white">{kills}</span>
          <span className="text-gray-700 text-xs">/</span>
          <span className="text-[#FF4655]">{deaths}</span>
          <span className="text-gray-700 text-xs">/</span>
          <span className="text-gray-400">{assists}</span>
        </div>
        <span className="text-gray-600 text-[9px] tabular-nums">{kd} K/D</span>
      </div>

      <div className="w-px bg-white/[0.05] self-stretch my-2 shrink-0" />

      {/* ACS · HS · DDΔ */}
      <div className="flex items-center gap-3 px-3 shrink-0">
        {[
          { label: 'ACS', value: acs },
          { label: 'HS%', value: `${hs}%` },
          { label: 'DDΔ', value: (dd >= 0 ? '+' : '') + dd, color: dd > 0 ? '#4AC97E' : dd < 0 ? '#FF4655' : undefined },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center gap-0.5 min-w-[34px]">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{s.label}</span>
            <span className="text-xs font-black tabular-nums" style={{ color: s.color ?? '#fff' }}>{s.value}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────

const NAV_TABS = ['Overview', 'Partidas', 'Agentes', 'Mapas', 'Armas']

type Props = { params: Promise<{ name: string; tag: string }> }

export default async function ProfilePage({ params }: Props) {
  const { name, tag } = await params
  const decodedName = decodeURIComponent(name)
  const decodedTag  = decodeURIComponent(tag)

  let account: AccountInfo
  let matches: Match[]

  try {
    account = await findAccount({ name: decodedName, tag: decodedTag })
    matches = await listMatches({ region: account.region, name: decodedName, tag: decodedTag, size: 20 })
  } catch {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-white font-bold text-lg">Jogador não encontrado</p>
        <p className="text-gray-500 text-sm">{decodedName}#{decodedTag}</p>
      </div>
    )
  }

  const stats      = computePlayerStats(matches, account.puuid)
  const groups     = groupByDate(matches)
  const topMaps    = computeTopMaps(matches, account.puuid)
  const lastPlayer = matches[0]?.players.all_players.find(p => p.puuid === account.puuid)
  const rank       = lastPlayer?.currenttier_patched ?? 'Unranked'
  const agentArt   = lastPlayer?.assets.agent.full

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden bg-[#0e0e0e]">
        {account.card.wide && (
          <Image src={account.card.wide} alt="" fill className="object-cover object-center opacity-20" unoptimized />
        )}
        {/* Gradientes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        {/* Agente art à direita */}
        {agentArt && (
          <div className="absolute right-0 top-0 h-full w-64 overflow-hidden">
            <Image src={agentArt} alt="" fill className="object-contain object-right-bottom opacity-60" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-transparent to-transparent" />
          </div>
        )}

        {/* Info do jogador */}
        <div className="relative flex items-end gap-4 px-6 pb-4 h-full">
          <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/20 shrink-0">
            {account.card.small
              ? <Image src={account.card.small} alt={account.name} fill className="object-cover" unoptimized />
              : <div className="w-full h-full bg-white/[0.06]" />}
          </div>
          <div className="flex flex-col gap-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-white font-black text-2xl tracking-tight">{account.name}</h1>
              <span className="text-gray-500 font-semibold text-sm bg-white/[0.08] border border-white/[0.08] px-2 py-0.5 rounded-lg">
                #{account.tag}
              </span>
              <span className="text-gray-600 text-xs uppercase tracking-widest bg-white/[0.04] px-2 py-0.5 rounded">
                {account.region}
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              Nível <span className="text-white font-bold">{account.account_level}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Nav Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-6 py-0 bg-[#0e0e0e] border-b border-white/[0.07]">
        {NAV_TABS.map((tab, i) => (
          <button key={tab} type="button" className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            i === 0
              ? 'text-[#FF4655] border-[#FF4655]'
              : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Body: sidebar + main ──────────────────────────────────────────── */}
      <div className="flex gap-4 p-5 flex-1">

        {/* Sidebar */}
        <div className="w-[240px] shrink-0 flex flex-col gap-3">
          <RatingCard rank={rank} />
          <AccuracyCard stats={stats} />
          <TopMapsCard maps={topMaps} />
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Stats overview */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-white/[0.07]">

            {/* Rank + Level + W/L */}
            <div className="relative flex items-center gap-5 px-5 py-4 bg-[#0e0e0e] overflow-hidden">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[64px] font-black text-white/[0.03] select-none pointer-events-none leading-none tracking-widest uppercase">
                {rankBase(rank)}
              </span>
              <Image src={rankIcon(rank)} alt={rank} width={48} height={48} unoptimized className="shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Rating</p>
                <p className="text-xl font-black text-white leading-tight">{rank}</p>
              </div>
              <div className="w-px h-8 bg-white/[0.08] shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Level</p>
                <p className="text-xl font-black text-white">{account.account_level}</p>
              </div>
              <WinLossDonut wins={stats.wins} losses={stats.total - stats.wins} />
            </div>

            {/* 4 primary stats */}
            <div className="flex divide-x divide-white/[0.06] bg-white/[0.02]">
              {[
                { label: 'Damage/Round', value: stats.adr },
                { label: 'K/D Ratio',   value: stats.kd  },
                { label: 'Headshot %',  value: `${stats.hsRate}%` },
                { label: 'Win %',       value: `${stats.winRate}%` },
              ].map(s => (
                <div key={s.label} className="flex-1 px-4 py-3">
                  <PrimaryStat label={s.label} value={s.value} />
                </div>
              ))}
            </div>

            {/* Secondary stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 px-5 py-3 border-t border-white/[0.06] bg-[#0e0e0e]">
              <SecondaryStat label="Vitórias"  value={stats.wins} />
              <SecondaryStat label="DDΔ/Round" value={(stats.ddDelta >= 0 ? '+' : '') + stats.ddDelta} />
              <SecondaryStat label="Kills"     value={stats.kills.toLocaleString('pt-BR')} />
              <SecondaryStat label="Deaths"    value={stats.deaths.toLocaleString('pt-BR')} />
              <SecondaryStat label="Assists"   value={stats.assists.toLocaleString('pt-BR')} />
              <SecondaryStat label="ACS"       value={stats.acs} />
            </div>

            {/* Tertiary stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
              <SecondaryStat label="KAD Ratio"   value={stats.kad} />
              <SecondaryStat label="Kills/Round" value={stats.kpr} />
            </div>
          </div>

          {/* Match history */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Últimas {matches.length} Partidas
            </p>
            {groups.map(({ date, matches: dm }) => (
              <div key={date} className="flex flex-col gap-1.5">
                <DateGroupHeader date={date} group={dm} puuid={account.puuid} />
                <div className="flex flex-col gap-1 pl-3 border-l-2 border-white/[0.05] ml-1">
                  {dm.map(m => (
                    <MatchCard key={m.metadata.matchid} match={m} puuid={account.puuid} />
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
