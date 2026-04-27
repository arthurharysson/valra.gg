export type RankBadgeVariant = 'filled' | 'outline'
export type RankBadgeSize    = 'sm' | 'md' | 'lg'

export interface RankBadgeProps {
  place: number
  variant?: RankBadgeVariant
  size?: RankBadgeSize
  className?: string
}
