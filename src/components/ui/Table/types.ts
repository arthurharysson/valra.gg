import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig<T> {
  key: keyof T | undefined
  direction: SortDirection
}

export interface Column<T> {
  Header: string
  accessor: keyof T
  format?: (value: T[keyof T], row: T) => ReactNode
  tdClassName?: string
  thClassName?: string
  align?: 'left' | 'center' | 'right'
}

export interface ActionIcon<T> {
  icon: ReactNode
  title?: string
  onClick?: (row: T) => void
}

export interface ActionColumn<T> {
  title?: string
  icons?: ActionIcon<T>[]
}

export interface ServerPaginationInfo {
  total?: number
  per_page?: number
  last_page?: number
  current_page?: number
  next_page_url?: string | null
  prev_page_url?: string | null
}

export type TableData<T> = T[] | { data: T[]; pagination?: ServerPaginationInfo }

export interface TableProps<T extends object> {
  columns: Column<T>[]
  data: TableData<T>
  actionColumn?: ActionColumn<T>
  itemsPerPage?: number
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  emptyMessage?: string
  onPageChange?: (page: number) => void
  getRowClassName?: (row: T, index: number) => string
  tableOptions?: {
    useServerPagination?: boolean
    externalPage?: number
  }
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToPage: (page: number) => void
  paginationInfo?: ServerPaginationInfo
}
