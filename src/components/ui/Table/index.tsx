'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import Pagination from './pagination'
import { useTable } from './hook'
import type { TableProps } from './types'

const SIZE_CLASS = {
  sm: { text: 'text-xs',  cell: 'px-4 py-3'  },
  md: { text: 'text-sm',  cell: 'px-5 py-4'  },
  lg: { text: 'text-base', cell: 'px-5 py-5' },
}

function SkeletonRows({ cols, hasActions }: { cols: number; hasActions: boolean }) {
  const total = hasActions ? cols + 1 : cols
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-b border-white/[0.05] animate-pulse">
          {Array.from({ length: total }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-3.5 rounded-md bg-white/[0.06] w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

/**
 * Table — Tabela genérica e reutilizável do Valra.gg.
 * Suporta sort client-side por coluna, paginação com elipses, skeleton loader e estado vazio.
 * Tema dark: header #1a1a1a, linhas com hover sutil, indicador de sort em #FF4655.
 * Usa TypeScript generics (T extends object) para aceitar qualquer shape de dados.
 */
export function Table<T extends object>({
  columns,
  data,
  actionColumn,
  itemsPerPage = 10,
  size = 'md',
  loading = false,
  emptyMessage = 'Nenhum dado encontrado',
  onPageChange,
  getRowClassName,
  tableOptions,
}: TableProps<T>) {
  const {
    paginated,
    handleSort,
    formatValue,
    sortConfig,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    paginationInfo,
    isServerPagination,
  } = useTable<T>(data, itemsPerPage <= 0 ? 10 : itemsPerPage, {
    useServerPagination: Boolean(tableOptions?.useServerPagination),
    onPageChange,
    externalPage: tableOptions?.externalPage,
  })

  const isEmpty = !loading && paginated.length === 0

  return (
    <div className="flex flex-col gap-3">
      {/* Tabela */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className={`min-w-full table-auto border-collapse ${SIZE_CLASS[size].text}`}>

          {/* Cabeçalho */}
          <thead>
            <tr className="bg-[#1a1a1a]">
              {columns.map((col, i) => (
                <th
                  key={`th-${i}`}
                  onClick={() => !isServerPagination && handleSort(col.accessor)}
                  className={[
                    'px-5 py-3.5 font-semibold text-xs uppercase tracking-wider',
                    'text-gray-500 border-b border-white/[0.08] select-none',
                    !isServerPagination ? 'cursor-pointer hover:text-gray-300 transition-colors duration-150' : '',
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                    col.thClassName ?? '',
                  ].join(' ')}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.Header}</span>
                    {sortConfig.key === col.accessor && (
                      sortConfig.direction === 'asc'
                        ? <ChevronUp size={13} className="text-[#FF4655] shrink-0" />
                        : <ChevronDown size={13} className="text-[#FF4655] shrink-0" />
                    )}
                  </div>
                </th>
              ))}
              {actionColumn && (
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 bg-[#1a1a1a] border-b border-white/[0.08]">
                  {actionColumn.title ?? 'Ações'}
                </th>
              )}
            </tr>
          </thead>

          {/* Corpo */}
          <tbody>
            {loading ? (
              <SkeletonRows cols={columns.length} hasActions={!!actionColumn} />
            ) : isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length + (actionColumn ? 1 : 0)}
                  className="px-5 py-12 text-center text-gray-600 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={`row-${i}`}
                  className={`border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors duration-150 ${getRowClassName?.(row, i) ?? ''}`}
                >
                  {columns.map((col, j) => (
                    <td
                      key={`cell-${i}-${j}`}
                      className={[
                        SIZE_CLASS[size].cell, 'text-gray-300',
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '',
                        col.tdClassName ?? 'max-w-[200px]',
                      ].join(' ')}
                    >
                      <div className="truncate">
                        {col.format
                          ? col.format(row[col.accessor], row)
                          : formatValue(row[col.accessor])}
                      </div>
                    </td>
                  ))}
                  {actionColumn && (
                    <td className={SIZE_CLASS[size].cell}>
                      <div className="flex items-center justify-center gap-1">
                        {actionColumn.icons?.map((action, k) => (
                          <button
                            key={k}
                            type="button"
                            title={action.title}
                            onClick={() => action.onClick?.(row)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all duration-150"
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        paginationInfo={paginationInfo}
      />
    </div>
  )
}
