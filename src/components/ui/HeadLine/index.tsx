import type { HeadLineProps } from './types'

/**
 * HeadLine — Título de seção com barra colorida à esquerda.
 * A cor da barra é configurável via prop color (padrão: #FF4655).
 */
export function HeadLine({ text, color = '#FF4655', className = '' }: HeadLineProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="w-1 h-10 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <h1 className="text-2xl font-bold text-white tracking-tight">{text}</h1>
    </div>
  )
}
