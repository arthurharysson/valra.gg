import { ArrowRight } from 'lucide-react'
import type { CardTopRankingProps } from './types'

// ── Cor de destaque por posição ──────────────────────────────────────────────

function getAccentColor(place: number): string {
  if (place === 1) return '#D4A017'
  if (place === 2) return '#9EA3B0'
  if (place === 3) return '#B5652A'
  return '#FF4655'
}

/**
 * CardTopRanking — Card horizontal de destaque para o top jogador de uma região.
 * Layout: avatar à esquerda, nome + plataforma + rating à direita.
 * Posição (#1, #2…) no canto superior direito em texto dourado.
 * Ícone radiant-ico de fundo com opacidade baixa.
 * Links de ação aparecem apenas no hover.
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
  const initials = playerName.slice(0, 2).toUpperCase()
  const hue      = (playerName.charCodeAt(0) * 17) % 360
  const accent   = getAccentColor(place)

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1a1d25]/90 backdrop-blur-md ${className}`}
    >
      {/* Radiant icon background — low opacity */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/icons/radiant-ico.webp"
        alt=""
        aria-hidden
        className="absolute right-2 bottom-1 w-20 h-20 object-contain opacity-[0.07] pointer-events-none select-none"
      />

      {/* Posição — canto superior direito */}
      <span
        className="absolute top-3 right-4 font-black text-xl select-none z-10"
        style={{ color: accent }}
      >
        #{place}
      </span>

      {/* Corpo do card */}
      <div className="relative z-10 flex items-center gap-4 px-5 py-6">

        {/* Avatar */}
        <div className="shrink-0">
          {avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatar}
              alt={playerName}
              width={52}
              height={52}
              className="w-[52px] h-[52px] rounded-full object-cover ring-2 ring-white/[0.10]"
            />
          ) : (
            <div
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white text-lg font-black ring-2 ring-white/[0.10]"
              style={{ backgroundColor: `hsl(${hue}, 45%, 22%)` }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-white font-bold text-lg leading-tight truncate">
            {playerName}
          </span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
            {region}
          </span>
          <span className="font-black text-3xl leading-none tabular-nums" style={{ color: accent }}>
            {rating.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Links — aparecem apenas no hover */}
      <div className="relative z-10 flex items-center border-t border-white/[0.06] divide-x divide-white/[0.06] opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-300 overflow-hidden">
        <button
          type="button"
          onClick={onLeaderboard}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
        >
          Leaderboard <ArrowRight size={12} />
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
        >
          Ver Perfil <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
