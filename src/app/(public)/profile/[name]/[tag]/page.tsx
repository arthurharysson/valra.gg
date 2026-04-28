import Image from 'next/image'
import { findAccount } from '@/lib/actions/account'
import { computePlayerStats, listMatches } from '@/lib/actions/matches'
import type { Match, MatchPlayer } from '@/lib/api/matches/types'
import type { AccountInfo } from '@/lib/api/account/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(unixSeconds: number): string {
  const diff = Date.now() - unixSeconds * 1000
  const m = Math.floor(diff / 60_000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d atrás`
  if (h > 0) return `${h}h atrás`
  if (m > 0) return `${m}m atrás`
  return 'agora'
}

function tierColor(patched: string): string {
  if (patched.startsWith('Iron'))      return '#9B8B7A'
  if (patched.startsWith('Bronze'))    return '#CD7F32'
  if (patched.startsWith('Silver'))    return '#C0C0C0'
  if (patched.startsWith('Gold'))      return '#F0B429'
  if (patched.startsWith('Platinum'))  return '#26D4D4'
  if (patched.startsWith('Diamond'))   return '#B89DFF'
  if (patched.startsWith('Ascendant')) return '#4AC97E'
  if (patched.startsWith('Immortal'))  return '#FF4655'
  if (patched.startsWith('Radiant'))   return '#FFD700'
  return '#6B7280'
}

function getPlayerInMatch(match: Match, puuid: string): MatchPlayer | undefined {
  return match.players.all_players.find(p => p.puuid === puuid)
}

function calcAcs(player: MatchPlayer, rounds: number): number {
  return rounds > 0 ? Math.round(player.stats.score / rounds) : 0
}

function calcHs(player: MatchPlayer): number {
  const total = player.stats.headshots + player.stats.bodyshots + player.stats.legshots
  return total > 0 ? Math.round((player.stats.headshots / total) * 100) : 0
}

function calcDd(player: MatchPlayer, rounds: number): number {
  return rounds > 0 ? Math.round((player.damage_made - player.damage_received) / rounds) : 0
}

function formatDateKey(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
  })
}

function groupByDate(matches: Match[]): { date: string; matches: Match[] }[] {
  const map = new Map<string, Match[]>()
  for (const match of matches) {
    const key = formatDateKey(match.metadata.game_start)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(match)
  }
  return Array.from(map.entries()).map(([date, ms]) => ({ date, matches: ms }))
}

interface GroupStats {
  wins: number
  losses: number
  kills: number
  deaths: number
  assists: number
  kd: string
  kda: string
  acs: number
  hsRate: number
  ddDelta: number
}

function computeGroupStats(matches: Match[], puuid: string): GroupStats {
  let kills = 0, deaths = 0, assists = 0
  let headshots = 0, bodyshots = 0, legshots = 0
  let score = 0, rounds = 0, damageMade = 0, damageReceived = 0
  let wins = 0

  for (const match of matches) {
    const player = match.players.all_players.find(p => p.puuid === puuid)
    if (!player) continue
    const team = match.teams[player.team.toLowerCase() as 'red' | 'blue']
    if (team?.has_won) wins++
    kills         += player.stats.kills
    deaths        += player.stats.deaths
    assists       += player.stats.assists
    headshots     += player.stats.headshots
    bodyshots     += player.stats.bodyshots
    legshots      += player.stats.legshots
    score         += player.stats.score
    rounds        += match.metadata.rounds_played
    damageMade    += player.damage_made
    damageReceived += player.damage_received
  }

  const shots = headshots + bodyshots + legshots
  return {
    wins,
    losses:  matches.length - wins,
    kills, deaths, assists,
    kd:      deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2),
    kda:     deaths > 0 ? ((kills + assists) / deaths).toFixed(2) : (kills + assists).toFixed(2),
    acs:     rounds > 0 ? Math.round(score / rounds) : 0,
    hsRate:  shots  > 0 ? Math.round((headshots / shots) * 100) : 0,
    ddDelta: rounds > 0 ? Math.round((damageMade - damageReceived) / rounds) : 0,
  }
}

// ── Rank icon ─────────────────────────────────────────────────────────────────

function rankIcon(patched: string): string {
  if (patched.startsWith('Bronze'))    return '/images/icons/bronze-ico.webp'
  if (patched.startsWith('Silver'))    return '/images/icons/silver-ico.webp'
  if (patched.startsWith('Gold'))      return '/images/icons/gold-ico.webp'
  if (patched.startsWith('Platinum'))  return '/images/icons/platinum-ico.webp'
  if (patched.startsWith('Diamond'))   return '/images/icons/diamond-ico.webp'
  if (patched.startsWith('Ascendant')) return '/images/icons/ascendent-ico.webp'
  if (patched.startsWith('Immortal'))  return '/images/icons/immortal-ico.webp'
  if (patched.startsWith('Radiant'))   return '/images/icons/radiant-ico.webp'
  return '/images/icons/iron-ico.webp'
}

function rankBase(patched: string): string {
  return patched.split(' ')[0].toUpperCase()
}

// ── W/L Donut ─────────────────────────────────────────────────────────────────

function WinLossDonut({ wins, losses }: { wins: number; losses: number }) {
  const total = wins + losses
  const r = 26
  const circ = 2 * Math.PI * r
  const dash = total > 0 ? (wins / total) * circ : 0
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#FF4655" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="#4AC97E" strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
        <span className="text-emerald-400 text-[10px] font-black leading-none">{wins} W</span>
        <span className="text-[#FF4655] text-[10px] font-black leading-none">{losses} L</span>
      </div>
    </div>
  )
}

// ── Componentes ───────────────────────────────────────────────────────────────

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black text-white">{value}</span>
      {sub && <span className="text-[11px] text-gray-600">{sub}</span>}
    </div>
  )
}

function PrimaryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-[#FF4655]/50 pl-3 flex-1">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className="text-2xl font-black text-white tabular-nums">{value}</span>
    </div>
  )
}

function SecondaryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[80px]">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <span className="text-xl font-black text-white tabular-nums">{value}</span>
    </div>
  )
}

function StatMini({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">{label}</span>
      <span className="text-sm font-black tabular-nums" style={{ color: color ?? '#fff' }}>{value}</span>
    </div>
  )
}

function DateGroupHeader({ date, group, puuid }: { date: string; group: Match[]; puuid: string }) {
  const s = computeGroupStats(group, puuid)
  const ddLabel = (s.ddDelta >= 0 ? '+' : '') + s.ddDelta

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl">
      {/* Data + badge + W/L */}
      <span className="text-white font-black text-base shrink-0">{date}</span>

      <span className="text-[11px] font-bold text-gray-500 bg-white/[0.07] border border-white/[0.08] px-2 py-0.5 rounded-lg shrink-0">
        {group.length}
      </span>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-emerald-400 font-bold text-sm">{s.wins} V</span>
        <span className="text-gray-600 text-xs font-bold">//</span>
        <span className="text-[#FF4655] font-bold text-sm">{s.losses} D</span>
      </div>

      {/* Stats do dia */}
      <div className="ml-auto flex items-center gap-4 shrink-0">
        <StatMini label="K/D"  value={s.kd} />

        <div className="w-px h-6 bg-white/[0.07]" />

        <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
          <span className="text-white font-semibold">{s.kills}</span>
          <span className="text-gray-600"> K · </span>
          <span className="text-white font-semibold">{s.deaths}</span>
          <span className="text-gray-600"> D · </span>
          <span className="text-white font-semibold">{s.assists}</span>
          <span className="text-gray-600"> A</span>
        </span>

        <div className="w-px h-6 bg-white/[0.07]" />

        <StatMini label="K/D/A" value={s.kda} />
        <StatMini label="DDΔ"   value={ddLabel} color={s.ddDelta > 0 ? '#4AC97E' : s.ddDelta < 0 ? '#FF4655' : '#6B7280'} />
        <StatMini label="HS%"   value={`${s.hsRate}%`} />
        <StatMini label="ACS"   value={s.acs} />
      </div>
    </div>
  )
}

function MatchCard({ match, puuid }: { match: Match; puuid: string }) {
  const player = getPlayerInMatch(match, puuid)
  if (!player) return null

  const team    = match.teams[player.team.toLowerCase() as 'red' | 'blue']
  const won     = team?.has_won ?? false
  const rwon    = team?.rounds_won ?? 0
  const rlost   = team?.rounds_lost ?? 0
  const rounds  = match.metadata.rounds_played
  const acs     = calcAcs(player, rounds)
  const hs      = calcHs(player)
  const dd      = calcDd(player, rounds)
  const { kills, deaths, assists } = player.stats
  const kd      = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2)
  const ddLabel = (dd >= 0 ? '+' : '') + dd

  return (
    <div className={`
      flex items-stretch rounded-xl overflow-hidden border transition-all duration-200
      ${won
        ? 'border-emerald-500/20 hover:border-emerald-500/35 bg-emerald-500/[0.03]'
        : 'border-[#FF4655]/15 hover:border-[#FF4655]/28 bg-[#FF4655]/[0.02]'
      }
    `}>

      {/* Stripe */}
      <div className={`w-[3px] shrink-0 ${won ? 'bg-emerald-500' : 'bg-[#FF4655]'}`} />

      {/* Agente */}
      <div className="relative w-[68px] h-[76px] shrink-0 overflow-hidden">
        <Image
          src={player.assets.agent.small}
          alt={player.character}
          fill
          className="object-cover object-top scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
      </div>

      {/* Agente + Rank */}
      <div className="flex flex-col justify-center px-3 w-32 shrink-0">
        <span className="text-white font-bold text-sm leading-tight truncate">{player.character}</span>
        <span className="text-xs font-semibold mt-0.5" style={{ color: tierColor(player.currenttier_patched) }}>
          {player.currenttier_patched}
        </span>
        <span className="text-gray-600 text-[10px] mt-1">{relativeTime(match.metadata.game_start)}</span>
      </div>

      <div className="w-px bg-white/[0.06] self-stretch my-3 shrink-0" />

      {/* Mapa + Modo */}
      <div className="flex flex-col justify-center px-4 flex-1 min-w-0">
        <span className="text-white font-bold text-sm truncate">{match.metadata.map}</span>
        <span className="text-gray-500 text-xs mt-0.5">{match.metadata.mode}</span>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center justify-center w-24 shrink-0">
        <span className={`text-[10px] font-black uppercase tracking-widest ${won ? 'text-emerald-400' : 'text-[#FF4655]'}`}>
          {won ? 'Vitória' : 'Derrota'}
        </span>
        <span className={`text-2xl font-black tabular-nums leading-tight ${won ? 'text-emerald-400' : 'text-[#FF4655]'}`}>
          {rwon}<span className="text-gray-600 text-lg mx-0.5">:</span>{rlost}
        </span>
      </div>

      <div className="w-px bg-white/[0.06] self-stretch my-3 shrink-0" />

      {/* K/D/A */}
      <div className="flex flex-col items-center justify-center w-28 shrink-0 px-3">
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">K / D / A</span>
        <div className="flex items-center gap-1">
          <span className="text-white font-black text-base tabular-nums">{kills}</span>
          <span className="text-gray-700">/</span>
          <span className="font-black text-base tabular-nums text-[#FF4655]">{deaths}</span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-400 font-bold text-base tabular-nums">{assists}</span>
        </div>
        <span className="text-gray-600 text-[10px] mt-0.5 tabular-nums">{kd} K/D</span>
      </div>

      <div className="w-px bg-white/[0.06] self-stretch my-3 shrink-0" />

      {/* Stats */}
      <div className="flex items-center gap-1 px-4 shrink-0">
        <div className="flex flex-col items-center gap-0.5 min-w-[44px]">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">ACS</span>
          <span className="text-sm font-black text-white tabular-nums">{acs}</span>
        </div>
        <div className="w-px h-6 bg-white/[0.06] mx-1" />
        <div className="flex flex-col items-center gap-0.5 min-w-[36px]">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">HS%</span>
          <span className="text-sm font-black text-white tabular-nums">{hs}%</span>
        </div>
        <div className="w-px h-6 bg-white/[0.06] mx-1" />
        <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">DDΔ</span>
          <span className="text-sm font-black tabular-nums" style={{ color: dd > 0 ? '#4AC97E' : dd < 0 ? '#FF4655' : '#6B7280' }}>
            {ddLabel}
          </span>
        </div>
      </div>

    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────

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

  const stats       = computePlayerStats(matches, account.puuid)
  const groups      = groupByDate(matches)
  const lastPlayer  = matches[0]?.players.all_players.find(p => p.puuid === account.puuid)
  const currentRank = lastPlayer?.currenttier_patched ?? 'Unranked'

  return (
    <div className="flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-48 overflow-hidden">
        {account.card.wide && (
          <Image src={account.card.wide} alt="card" fill className="object-cover object-center opacity-25" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        <div className="relative flex items-end gap-4 px-6 pb-6 h-full">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white/[0.15] shrink-0">
            {account.card.small
              ? <Image src={account.card.small} alt={account.name} fill className="object-cover" unoptimized />
              : <div className="w-full h-full bg-white/[0.06]" />
            }
          </div>
          <div className="flex flex-col gap-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-white font-black text-2xl tracking-tight">{account.name}</h1>
              <span className="text-gray-500 font-semibold text-sm bg-white/[0.07] border border-white/[0.08] px-2 py-0.5 rounded-lg">
                #{account.tag}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                Nível <span className="text-white font-bold">{account.account_level}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="text-gray-600 text-xs uppercase tracking-widest">{account.region}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Conteúdo ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 p-6">

        {/* ── Stats Overview ────────────────────────────────────────────── */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-white/[0.07]">

          {/* Linha 1 — Rank + Level + W/L */}
          <div className="relative flex items-center gap-6 px-6 py-5 bg-[#0e0e0e] overflow-hidden">
            {/* Watermark */}
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[72px] font-black text-white/[0.04] select-none pointer-events-none leading-none tracking-widest uppercase">
              {rankBase(currentRank)}
            </span>

            {/* Rank */}
            <div className="flex items-center gap-3 shrink-0">
              <Image src={rankIcon(currentRank)} alt={currentRank} width={52} height={52} unoptimized />
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Rating</span>
                <span className="text-2xl font-black text-white leading-tight">{currentRank}</span>
              </div>
            </div>

            <div className="w-px h-10 bg-white/[0.08] shrink-0" />

            {/* Level */}
            <div className="flex flex-col shrink-0">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Level</span>
              <span className="text-2xl font-black text-white">{account.account_level}</span>
            </div>

            {/* W/L Donut */}
            <WinLossDonut wins={stats.wins} losses={stats.total - stats.wins} />
          </div>

          {/* Linha 2 — 4 stats primários */}
          <div className="flex divide-x divide-white/[0.06] bg-white/[0.02]">
            {[
              { label: 'Damage/Round', value: stats.adr },
              { label: 'K/D Ratio',    value: stats.kd  },
              { label: 'Headshot %',   value: `${stats.hsRate}%` },
              { label: 'Win %',        value: `${stats.winRate}%` },
            ].map(s => (
              <div key={s.label} className="flex-1 px-5 py-4">
                <PrimaryStat label={s.label} value={s.value} />
              </div>
            ))}
          </div>

          {/* Linha 3 — stats secundários */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 px-6 py-4 border-t border-white/[0.06] bg-[#0e0e0e]">
            <SecondaryStat label="Vitórias"   value={stats.wins} />
            <SecondaryStat label="DDΔ/Round"  value={(stats.ddDelta >= 0 ? '+' : '') + stats.ddDelta} />
            <SecondaryStat label="Kills"      value={stats.kills.toLocaleString('pt-BR')} />
            <SecondaryStat label="Deaths"     value={stats.deaths.toLocaleString('pt-BR')} />
            <SecondaryStat label="Assists"    value={stats.assists.toLocaleString('pt-BR')} />
            <SecondaryStat label="ACS"        value={stats.acs} />
          </div>

          {/* Linha 4 — mais stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
            <SecondaryStat label="KAD Ratio"    value={stats.kad} />
            <SecondaryStat label="Kills/Round"  value={stats.kpr} />
          </div>

        </div>

        {/* Histórico agrupado por data */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">
            Histórico de Partidas
          </p>

          {groups.length === 0 ? (
            <p className="text-gray-600 text-sm py-12 text-center">Nenhuma partida encontrada</p>
          ) : (
            groups.map(({ date, matches: dayMatches }) => (
              <div key={date} className="flex flex-col gap-1.5">
                <DateGroupHeader date={date} group={dayMatches} puuid={account.puuid} />
                <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-white/[0.05] ml-1">
                  {dayMatches.map(match => (
                    <MatchCard key={match.metadata.matchid} match={match} puuid={account.puuid} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
