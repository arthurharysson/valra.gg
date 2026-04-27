'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/data/navigation'
import type { SidebarProps } from './types'

/**
 * Sidebar — Barra lateral compacta com ícone + label abaixo de cada item.
 * Ativa detectada via usePathname: item ativo ganha fundo colorido (red) no ícone.
 * Largura fixa de 72px, estilo escuro com borda direita sutil.
 */
export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`w-[88px] min-h-screen shrink-0 flex flex-col items-center bg-[#161616] border-r border-white/[0.08] py-3 ${className}`}
    >
      {/* Monograma / Logo */}
      <div className="w-full flex items-center justify-center h-14 mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo/logo-v.png"
          alt="Valra.gg"
          width={36}
          height={36}
          className="w-16 h-16 object-contain"
        />
      </div>  

      {/* Divisor */}
      <div className="w-10 h-px bg-white/[0.08] mb-3" />

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 w-full py-2 rounded-xl transition-all duration-200 group"
            >
              {/* Ícone */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isActive
                    ? 'bg-[#FF4655] shadow-[0_4px_14px_rgba(255,70,85,0.35)]'
                    : 'bg-transparent group-hover:bg-white/[0.07]'
                  }
                `}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium leading-none text-center transition-colors duration-200 ${
                  isActive ? 'text-[#FF4655]' : 'text-gray-600 group-hover:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Divisor */}
      <div className="w-10 h-px bg-white/[0.08] mt-3 mb-3" />

      {/* Footer */}
      <p className="text-[9px] text-gray-700 tracking-widest font-medium rotate-0 select-none">
        2025
      </p>
    </aside>
  )
}
