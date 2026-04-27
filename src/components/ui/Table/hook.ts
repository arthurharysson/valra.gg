import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { ServerPaginationInfo, TableData } from './types'

interface UseTableOptions {
  useServerPagination?: boolean
  onPageChange?: (page: number) => void
  externalPage?: number
}

function extractData<T>(raw: TableData<T>): { data: T[]; pagination?: ServerPaginationInfo } {
  if (!raw) return { data: [] }
  if (Array.isArray(raw)) return { data: raw }
  if (typeof raw === 'object' && 'data' in raw) {
    return {
      data: Array.isArray(raw.data) ? raw.data : [],
      pagination: raw.pagination,
    }
  }
  return { data: [] }
}

export function useTable<T extends object>(
  rawData: TableData<T>,
  itemsPerPage = 10,
  options: UseTableOptions = {}
) {
  const { useServerPagination = false, onPageChange, externalPage } = options

  const [currentPage, setCurrentPage] = useState(externalPage ?? 1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | undefined
    direction: 'asc' | 'desc'
  }>({ key: undefined, direction: 'asc' })

  const deferred = useDeferredValue(rawData)
  const { data, pagination } = useMemo(() => extractData<T>(deferred), [deferred])

  useEffect(() => {
    if (externalPage !== undefined) setCurrentPage(externalPage)
  }, [externalPage])

  const handleSort = (key: keyof T) => {
    if (useServerPagination) return
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sorted = useMemo(() => {
    if (!sortConfig.key || useServerPagination) return [...data]
    return [...data].sort((a, b) => {
      const av = a[sortConfig.key!]
      const bv = b[sortConfig.key!]
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig, useServerPagination])

  const paginated = useMemo(() => {
    if (useServerPagination) return data
    const start = (currentPage - 1) * itemsPerPage
    return sorted.slice(start, start + itemsPerPage)
  }, [sorted, currentPage, itemsPerPage, useServerPagination, data])

  const totalPages = useMemo(() => {
    if (pagination?.last_page) return pagination.last_page
    if (pagination?.total && pagination?.per_page)
      return Math.ceil(pagination.total / pagination.per_page)
    return Math.max(1, Math.ceil(data.length / itemsPerPage))
  }, [pagination, data.length, itemsPerPage])

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    onPageChange?.(page)
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—'
    return String(value)
  }

  return {
    paginated: paginated as T[],
    handleSort,
    formatValue,
    sortConfig,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage: () => goToPage(currentPage + 1),
    goToPreviousPage: () => goToPage(currentPage - 1),
    paginationInfo: pagination,
    isServerPagination: useServerPagination,
  }
}
