import { RankBadge } from '@/components/ui/RankBadge'
import type { CardTopRankingProps } from './types'

// ── Cor de destaque por posição ──────────────────────────────────────────────

function getAccentColor(place: number): string {
  if (place === 1) return '#D4A017'
  if (place === 2) return '#9EA3B0'
  if (place === 3) return '#B5652A'
  return '#FF4655'
}

function getGlowColor(place: number): string {
  if (place === 1) return 'rgba(212, 160, 23, 0.15)'
  if (place === 2) return 'rgba(158, 163, 176, 0.10)'
  if (place === 3) return 'rgba(181, 101, 42, 0.15)'
  return 'rgba(255, 70, 85, 0.10)'
}

/**
 * CardTopRanking — Card de destaque para o top jogador de uma região.
 * Exibe avatar com iniciais, badge de posição (RankBadge), nome, label de região,
 * rating em destaque e botão de acesso ao leaderboard.
 * Glassmorphism com borda superior colorida pelo rank.
 */
export function CardTopRanking({
  playerName,
  tag,
  place,
  region,
  rating,
  avatar,
  onLeaderboard,
  className = '',
}: CardTopRankingProps) {
  const initials   = playerName.slice(0, 2).toUpperCase()
  const hue        = (playerName.charCodeAt(0) * 17) % 360
  const accent     = getAccentColor(place)
  const glowColor  = getGlowColor(place)

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.04] backdrop-blur-md min-w-[180px] w-full ${className}`}
      style={{ boxShadow: `0 0 32px ${glowColor}` }}
    >
      {/* Barra superior colorida pelo rank */}
      <div className="h-0.5 w-full" style={{ backgroundColor: accent }} />

      {/* Corpo */}
      <div className="flex flex-col items-center px-6 pt-8 pb-5 gap-3 flex-1">

        {/* Avatar + badge */}
        <div className="relative">
          {avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatar}
              alt={playerName}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white/[0.08]"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-black ring-2 ring-white/[0.08]"
              style={{ backgroundColor: `hsl(${hue}, 45%, 22%)` }}
            >
              {initials}
            </div>
          )}

          {/* Badge de posição — canto superior direito do avatar */}
          <div className="absolute -top-2 -right-3">
            <RankBadge place={place} variant="filled" size="sm" />
          </div>
        </div>

        {/* Nome + tag */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-white font-bold text-base leading-tight text-center">
            {playerName}
          </span>
          {tag && (
            <span className="text-gray-600 text-xs">#{tag}</span>
          )}
        </div>

        {/* Label + rating */}
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
            Top {region} Rating
          </span>
          <span className="text-white font-black text-4xl leading-none tabular-nums">
            {rating}
          </span>
        </div>
      </div>

      {/* Botão Leaderboard */}
      <div className="border-t border-white/[0.08]">
        <button
          type="button"
          onClick={onLeaderboard}
          className="w-full py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-white hover:bg-white/[0.04] transition-all duration-200"
        >
          Leaderboard
        </button>
      </div>
    </div>
  )
}
