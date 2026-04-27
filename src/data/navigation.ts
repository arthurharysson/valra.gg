import { Home, Trophy, Crosshair, User, Sword, SwordsIcon, NewspaperIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Home',         href: '/',             icon: Home      },
  { label: 'Ranking',      href: '/ranking',       icon: Trophy      },
  { label: 'Esports',      href: '/esports',      icon: SwordsIcon    },
  { label: 'Pro Settings', href: '/pro-settings', icon: Crosshair },
  { label: 'Perfil',       href: '/profile',      icon: User      },
  {label: 'News', href: '/news', icon: NewspaperIcon}
]
