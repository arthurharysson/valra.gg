export interface CardTopRankingProps {
  playerName: string
  tag?: string
  place: number
  region: string
  rating: number
  avatar?: string
  onLeaderboard?: () => void
  className?: string
}
