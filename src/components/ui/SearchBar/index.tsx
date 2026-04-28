'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'
import type { SearchBarProps } from './types'

/**
 * SearchBar — Campo de busca reutilizável do Valra.gg.
 * Pode ser controlado (value + onChange) ou não controlado com estado interno.
 * Borda acende em vermelho no foco; botão clear aparece ao digitar.
 * Dispara onSearch ao pressionar Enter ou clicar no ícone de lupa.
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar...',
  disabled = false,
  className = '',
}: SearchBarProps) {
  const [internal, setInternal] = useState('')
  const [focused, setFocused] = useState(false)

  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  const handleClear = () => {
    if (!isControlled) setInternal('')
    onChange?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch?.(current)
  }

  const hasBg     = className.includes('bg-')
  const hasBorder = className.includes('border-')
  const defaultBg     = hasBg     ? '' : 'bg-white/[0.05]'
  const defaultBorder = hasBorder ? '' : focused
    ? 'border-[#FF4655]/50 shadow-[0_0_0_3px_rgba(255,70,85,0.08)]'
    : 'border-white/[0.08]'

  return (
    <div
      className={`
        flex items-center gap-2.5 px-3.5 h-10 rounded-xl
        border transition-all duration-200
        ${defaultBg} ${defaultBorder}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Ícone lupa — clicável para disparar busca */}
      <button
        type="button"
        onClick={() => onSearch?.(current)}
        disabled={disabled}
        className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors duration-150 disabled:pointer-events-none"
        tabIndex={-1}
      >
        <Search size={15} strokeWidth={2} />
      </button>

      {/* Input */}
      <input
        type="text"
        value={current}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-600 outline-none disabled:cursor-not-allowed min-w-0"
      />

      {/* Botão clear */}
      {current && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 text-gray-600 hover:text-gray-300 transition-colors duration-150"
          tabIndex={-1}
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
