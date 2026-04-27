'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationProps } from './types'

/**
 * Pagination — Controle de paginação para o componente Table.
 * Gera elipses inteligentes e exibe intervalo de resultados quando pagination info disponível.
 * Tema dark: página ativa em #FF4655, botões com hover sutil.
 */
export default function Pagination({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  paginationInfo,
}: PaginationProps) {
  const RANGE = 2

  const pages = (() => {
    const result: (number | '...')[] = []
    if (currentPage > 1 + RANGE) {
      result.push(1)
      if (currentPage > 2 + RANGE) result.push('...')
    }
    for (
      let i = Math.max(1, currentPage - RANGE);
      i <= Math.min(totalPages, currentPage + RANGE);
      i++
    ) {
      result.push(i)
    }
    if (currentPage < totalPages - RANGE) {
      if (currentPage < totalPages - 1 - RANGE) result.push('...')
      result.push(totalPages)
    }
    return result
  })()

  const showingFrom = paginationInfo?.per_page
    ? (currentPage - 1) * paginationInfo.per_page + 1
    : null
  const showingTo = paginationInfo?.per_page
    ? Math.min(currentPage * paginationInfo.per_page, paginationInfo.total ?? 0)
    : null

  if (totalPages <= 1) return null

  const btn =
    'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150'

  return (
    <div className="flex flex-col items-center gap-2.5 mt-1 pb-1">
      {showingFrom && showingTo && paginationInfo?.total && (
        <p className="text-xs text-gray-600">
          Mostrando{' '}
          <span className="text-gray-400">{showingFrom}–{showingTo}</span> de{' '}
          <span className="text-gray-400">{paginationInfo.total}</span> resultados
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          className={`${btn} ${
            currentPage <= 1
              ? 'text-gray-700 cursor-not-allowed'
              : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`el-${i}`} className="w-8 text-center text-gray-600 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page as number)}
              className={`${btn} ${
                currentPage === page
                  ? 'bg-[#FF4655] text-white shadow-[0_2px_10px_rgba(255,70,85,0.3)]'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className={`${btn} ${
            currentPage >= totalPages
              ? 'text-gray-700 cursor-not-allowed'
              : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
