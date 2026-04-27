import type { SeasonTimerProps } from './types'

const TICK_COUNT = 60

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/**
 * SeasonTimer — Anel circular de contagem regressiva da temporada.
 * SVG com anel de progresso vermelho + glow, ticks ao redor e texto centralizado.
 * O anel parte do topo (−90°) no sentido horário conforme progress (0–1).
 */
export function SeasonTimer({
  label = 'Season Ends:',
  timeLeft,
  progress = 0.65,
  size = 280,
  className = '',
}: SeasonTimerProps) {
  const center      = size / 2
  const radius      = size * 0.39
  const circumference = 2 * Math.PI * radius
  const offset      = circumference * (1 - progress)

  const tickInner   = radius + size * 0.04
  const tickOuter   = radius + size * 0.09

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Glow vermelho */}
          <filter id="st-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow tick major */}
          <filter id="st-tick-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke="rgba(255,70,85,0.12)"
          strokeWidth={size * 0.016}
        />

        {/* Progresso */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke="#FF4655"
          strokeWidth={size * 0.016}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          filter="url(#st-glow)"
        />

        {/* Ticks */}
        {Array.from({ length: TICK_COUNT }).map((_, i) => {
          const angle      = (i * 360) / TICK_COUNT
          const isMajor    = i % 5 === 0
          const innerR     = isMajor ? tickInner - size * 0.01 : tickInner
          const outerR     = isMajor ? tickOuter + size * 0.01 : tickOuter
          const p1         = polarToCartesian(center, center, innerR, angle)
          const p2         = polarToCartesian(center, center, outerR, angle)
          const isActive   = i / TICK_COUNT <= progress

          return (
            <line
              key={i}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={isActive ? '#FF4655' : 'rgba(255,255,255,0.08)'}
              strokeWidth={isMajor ? 2.5 : 1}
              strokeLinecap="round"
              filter={isActive && isMajor ? 'url(#st-tick-glow)' : undefined}
            />
          )
        })}
      </svg>

      {/* Texto centralizado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          {label}
        </span>
        <span
          className="font-black text-white leading-none"
          style={{ fontSize: size * 0.115 }}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  )
}
