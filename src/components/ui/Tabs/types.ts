import type { LucideIcon } from 'lucide-react'

export type TabVariant = 'filled' | 'outline'
export type TabColor   = 'red' | 'navy' | 'default'

export interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  onOptions?: (id: string) => void
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  variant?: TabVariant
  color?: TabColor
  multiActive?: string[]
  className?: string
}
