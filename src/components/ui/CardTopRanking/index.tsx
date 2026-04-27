import type { CardTopRankingProps } from './types'

// ── Cor de destaque por posição ──────────────────────────────────────────────

function getAccentColor(place: number): string {
  if (place === 1) return '#D4A017'
  if (place === 2) return '#9EA3B0'
  if (place === 3) return '#B5652A'
  return '#FF4655'
}

/**
 * CardTopRanking — Card vertical de destaque para o top jogador de uma região.
 * Badge de posição no canto superior direito, parcialmente fora do card.
 * Radiant-ico como background opaco.
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
    <div className={`relative ${className}`}>

      {/* Badge de posição — fora do card, canto superior direito */}
      <div
        className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-base font-black shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-30 border-[3px] border-[#111111]"
        style={{ backgroundColor: accent, color: '#ffffff' }}
      >
        #{place}
      </div>

      {/* Card */}
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.10]"
        style={{ backgroundColor: '#12171cff' }}
      >
        {/* Radiant icon background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/icons/radiant-ico.webp"
          alt=""
          aria-hidden
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-36 h-36 object-contain opacity-[0.06] pointer-events-none select-none"
        />

        {/* Corpo */}
        <div className="relative z-10 flex flex-col items-center px-7 pt-8 pb-5 gap-2">

          {/* Avatar */}
          <div className="mb-2">
            {avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatar}
                alt={playerName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover ring-[3px] ring-white/[0.15]"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black ring-[3px] ring-white/[0.15]"
                style={{ backgroundColor: `hsl(${hue}, 45%, 22%)` }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Nome */}
          <span className="text-white font-bold text-lg leading-tight text-center truncate max-w-full">
            {playerName}
          </span>

          {/* Label */}
          <span className="text-[#FF4655] text-[11px] font-semibold uppercase tracking-wider mt-1">
            Rating
          </span>

          {/* Número do rating */}
          <span className="text-white font-black text-[40px] leading-none tabular-nums">
            {rating.toLocaleString('pt-BR')}
          </span>

          {/* Região */}
          <span className="text-white-500 text-sm font-bold">
            {region}
          </span>
        </div>

        {/* Botão Leaderboard — barra preenchida no fundo */}
        <button
          type="button"
          onClick={onLeaderboard}
          className="relative z-10 w-full py-3.5 text-sm font-bold text-white tracking-wide bg-white/[0.08] hover:bg-white/[0.14] transition-all duration-200 cursor-pointer"
        >
          Leaderboard
        </button>
      </div>
    </div>
  )
}
