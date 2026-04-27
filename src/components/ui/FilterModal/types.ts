export interface FilterOption {
  id: string
  label: string
}

export interface FilterGroup {
  label: string
  options: FilterOption[]
}

export interface FilterCategory {
  id: string
  label: string
  options?: FilterOption[]
  groups?: FilterGroup[]
}

export interface FilterModalProps {
  open: boolean
  onClose: () => void
  categories: FilterCategory[]
  values: Record<string, string[]>
  onChange: (categoryId: string, selected: string[]) => void
  onReset: () => void
  onSave: () => void
  initialCategory?: string
}
