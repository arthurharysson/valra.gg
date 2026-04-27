'use client'

import { MoreVertical } from 'lucide-react'
import type { TabColor, TabVariant, TabsProps } from './types'

// ── Estilos por variante + cor ───────────────────────────────────────────────

const ACTIVE: Record<TabVariant, Record<TabColor, string>> = {
  filled: {
    red:     'bg-[#FF4655] text-white border-[#FF4655]',
    navy:    'bg-[#0D1B2A] text-white border-[#0D1B2A]',
    default: 'bg-white/[0.12] text-white border-white/[0.12]',
  },
  outline: {
    red:     'bg-transparent text-[#FF4655] border-[#FF4655]',
    navy:    'bg-transparent text-[#4a90d9] border-[#0D1B2A]',
    default: 'bg-transparent text-white border-white/40',
  },
}

const INACTIVE: Record<TabVariant, string> = {
  filled:  'bg-transparent text-gray-400 border-white/[0.08] hover:border-white/20 hover:text-gray-200',
  outline: 'bg-transparent text-gray-500 border-white/[0.08] hover:border-white/20 hover:text-gray-300',
}

const DIVIDER: Record<TabVariant, Record<TabColor, string>> = {
  filled: {
    red:     'bg-white/30',
    navy:    'bg-white/30',
    default: 'bg-white/20',
  },
  outline: {
    red:     'bg-[#FF4655]/40',
    navy:    'bg-[#4a90d9]/40',
    default: 'bg-white/20',
  },
}

const OPTIONS_ACTIVE: Record<TabVariant, Record<TabColor, string>> = {
  filled: {
    red:     'text-white/70 hover:text-white',
    navy:    'text-white/70 hover:text-white',
    default: 'text-white/70 hover:text-white',
  },
  outline: {
    red:     'text-[#FF4655]/60 hover:text-[#FF4655]',
    navy:    'text-[#4a90d9]/60 hover:text-[#4a90d9]',
    default: 'text-white/50 hover:text-white',
  },
}

/**
 * Tabs — Pills horizontais de navegação/filtro do Valra.gg.
 * Suporta variantes "filled" (sólido) e "outline" (borda), com cores red, navy ou default.
 * Ícone esquerdo e botão ⋮ de opções são opcionais por item.
 * Componente controlado: estado ativo gerenciado pelo pai via value/onChange.
 */
export function Tabs({
  items,
  value,
  onChange,
  variant = 'filled',
  color = 'red',
  multiActive,
  className = '',
}: TabsProps) {
  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {items.map((item) => {
        const isActive = multiActive ? multiActive.includes(item.id) : item.id === value
        const Icon = item.icon
        const hasOptions = Boolean(item.onOptions)

        return (
          <div
            key={item.id}
            className={`
              inline-flex items-center border rounded-xl overflow-hidden
              transition-all duration-200 text-base font-semibold select-none
              ${isActive ? ACTIVE[variant][color] : INACTIVE[variant]}
            `}
          >
            {/* Área principal — label + ícone */}
            <button
              type="button"
              onClick={() => onChange(item.id)}
              className={`
                flex items-center gap-2.5 px-4 py-2.5
                ${hasOptions ? '' : 'pr-5'}
              `}
            >
              {Icon && <Icon size={17} strokeWidth={2} className="shrink-0" />}
              <span>{item.label}</span>
            </button>

            {/* Divisor + botão ⋮ */}
            {hasOptions && (
              <>
                <div className={`w-px h-4 shrink-0 ${isActive ? DIVIDER[variant][color] : 'bg-white/[0.08]'}`} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    item.onOptions?.(item.id)
                  }}
                  className={`
                    px-2.5 py-2.5 transition-colors duration-150
                    ${isActive ? OPTIONS_ACTIVE[variant][color] : 'text-gray-600 hover:text-gray-400'}
                  `}
                >
                  <MoreVertical size={18} strokeWidth={3} />
                </button>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}