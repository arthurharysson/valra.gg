import type { RankBadgeProps, RankBadgeVariant } from './types'

// ── Paleta por posição ───────────────────────────────────────────────────────

interface RankPalette {
  bg: string
  border: string
  text: string
  glow: string
}

function getPalette(place: number): RankPalette {
  if (place === 1) return {
    bg:     'rgba(212, 160, 23, 0.18)',
    border: '#D4A017',
    text:   '#F5C842',
    glow:   '0 0 16px rgba(212, 160, 23, 0.45)',
  }
  if (place === 2) return {
    bg:     'rgba(158, 163, 176, 0.15)',
    border: '#9EA3B0',
    text:   '#C8CDD8',
    glow:   '0 0 12px rgba(158, 163, 176, 0.25)',
  }
  if (place === 3) return {
    bg:     'rgba(181, 101, 42, 0.18)',
    border: '#B5652A',
    text:   '#D4844A',
    glow:   '0 0 12px rgba(181, 101, 42, 0.35)',
  }
  return {
    bg:     'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.15)',
    text:   '#6B7280',
    glow:   'none',
  }
}

// ── Tamanhos ─────────────────────────────────────────────────────────────────

const SIZES = {
  sm: { outer: 36, font: 13, clip: 30 },
  md: { outer: 52, font: 18, clip: 44 },
  lg: { outer: 68, font: 24, clip: 58 },
}

// ── Clip-path hexágono vertical ──────────────────────────────────────────────
// polygon: topo-centro, direita-cima, direita-baixo, baixo-centro, esq-baixo, esq-cima
const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

// ── Estilos inline por variante ──────────────────────────────────────────────

function buildStyles(
  place: number,
  variant: RankBadgeVariant,
  size: number,
): { wrapper: React.CSSProperties; hex: React.CSSProperties; number: React.CSSProperties } {
  const { bg, border, text, glow } = getPalette(place)

  if (variant === 'filled') {
    return {
      wrapper: { width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
      hex: {
        position: 'absolute', inset: 0,
        clipPath: HEX,
        backgroundColor: bg,
        boxShadow: glow,
      },
      number: { position: 'relative', zIndex: 1, color: text, fontWeight: 900, lineHeight: 1 },
    }
  }

  // outline: usamos dois hexágonos sobrepostos (borda + fundo vazado)
  const borderPx = 2
  return {
    wrapper: { width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    hex: {
      position: 'absolute', inset: 0,
      clipPath: HEX,
      backgroundColor: border,
      boxShadow: glow,
    },
    number: { position: 'relative', zIndex: 1, color: text, fontWeight: 900, lineHeight: 1 },
  }
  // nota: o inner hex para criar o efeito outline é montado no JSX
  void borderPx
}

/**
 * RankBadge — Badge hexagonal de posição no ranking.
 * Top 3 têm paleta exclusiva (ouro, prata, bronze) com glow sutil.
 * Variant "filled": fundo sólido semitransparente. "outline": apenas borda hexagonal colorida.
 * Sizes: sm (36px), md (52px), lg (68px).
 */
export function RankBadge({
  place,
  variant = 'filled',
  size = 'md',
  className = '',
}: RankBadgeProps) {
  const { outer, font, clip } = SIZES[size]
  const { bg, border, text, glow } = getPalette(place)
  const isTop3 = place <= 3

  return (
    <div
      className={className}
      style={{ width: outer, height: outer, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
    >
      {variant === 'filled' ? (
        /* Filled: hexágono com fundo colorido */
        <div
          style={{
            position: 'absolute', inset: 0,
            clipPath: HEX,
            backgroundColor: bg,
            boxShadow: isTop3 ? glow : undefined,
          }}
        />
      ) : (
        /* Outline: hexágono de borda (cor) + hexágono interno menor (fundo escuro) */
        <>
          <div
            style={{
              position: 'absolute', inset: 0,
              clipPath: HEX,
              backgroundColor: border,
              boxShadow: isTop3 ? glow : undefined,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: clip, height: clip,
              clipPath: HEX,
              backgroundColor: '#111111',
            }}
          />
        </>
      )}

      {/* Número */}
      <span
        style={{
          position: 'relative', zIndex: 1,
          color: text,
          fontSize: font,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {place}
      </span>
    </div>
  )
}
