'use client'

import { RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FilterModalProps } from './types'

/**
 * FilterModal — Modal de filtros com sidebar de categorias e painel de opções.
 * Sidebar esquerda: lista de categorias com indicador de seleção ativa (ponto vermelho).
 * Painel direito: opções flat ou agrupadas com pills toggleáveis.
 * Fecha ao clicar no overlay, no X ou pressionar Escape.
 */
export function FilterModal({
  open,
  onClose,
  categories,
  values,
  onChange,
  onReset,
  onSave,
  initialCategory,
}: FilterModalProps) {
  const [activeCategory, setActiveCategory] = useState(
    initialCategory ?? categories[0]?.id ?? ''
  )

  useEffect(() => {
    if (open && initialCategory) setActiveCategory(initialCategory)
  }, [open, initialCategory])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const category = categories.find(c => c.id === activeCategory)
  const selected = values[activeCategory] ?? []

  const toggle = (optionId: string) => {
    const current = values[activeCategory] ?? []
    const next = current.includes(optionId)
      ? current.filter(id => id !== optionId)
      : [...current, optionId]
    onChange(activeCategory, next)
  }

  const optionPill = (id: string, label: string) => {
    const isSelected = selected.includes(id)
    return (
      <button
        key={id}
        type="button"
        onClick={() => toggle(id)}
        className={`
          px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide
          border transition-all duration-150
          ${isSelected
            ? 'bg-[#FF4655]/15 text-[#FF4655] border-[#FF4655]/30'
            : 'bg-white/[0.04] text-gray-400 border-white/[0.08] hover:border-white/[0.2] hover:text-gray-200'
          }
        `}
      >
        {label}
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-[860px] max-w-[95vw] max-h-[80vh] bg-[#161616] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >

        {/* ── Sidebar esquerda ───────────────────────────────── */}
        <div className="w-52 shrink-0 bg-[#111111] border-r border-white/[0.08] flex flex-col">

          <div className="px-5 py-5 border-b border-white/[0.08]">
            <h2 className="text-sm font-black text-white tracking-widest uppercase">Filtros</h2>
          </div>

          <nav className="flex-1 py-2 overflow-y-auto">
            {categories.map(cat => {
              const isActive = cat.id === activeCategory
              const hasSelection = (values[cat.id] ?? []).length > 0
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    w-full flex items-center justify-between px-5 py-3.5
                    text-sm font-medium text-left border-l-2 transition-all duration-150
                    ${isActive
                      ? 'bg-[#FF4655]/10 text-white border-[#FF4655]'
                      : 'text-gray-400 border-transparent hover:bg-white/[0.04] hover:text-gray-200'
                    }
                  `}
                >
                  <span>{cat.label}</span>
                  {hasSelection && (
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-[#FF4655]' : 'bg-[#FF4655]/50'}`} />
                  )}
                </button>
              )
            })}
          </nav>

          <div className="px-4 py-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onSave}
              className="w-full py-2.5 rounded-xl border border-white/[0.12] text-sm font-semibold text-gray-300 hover:bg-white/[0.06] hover:text-white transition-all duration-150"
            >
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* ── Painel direito ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] shrink-0">
            <h3 className="text-sm font-black text-white tracking-widest uppercase">
              {category?.label}
            </h3>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#FF4655] hover:text-[#e03e4d] transition-colors duration-150"
              >
                <RefreshCw size={12} />
                Redefinir
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors duration-150"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {category?.groups ? (
              category.groups.map(group => (
                <div key={group.label} className="flex flex-col gap-3">
                  <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map(opt => optionPill(opt.id, opt.label))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-wrap gap-2">
                {category?.options?.map(opt => optionPill(opt.id, opt.label))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
