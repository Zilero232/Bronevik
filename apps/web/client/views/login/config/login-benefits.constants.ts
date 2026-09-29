import { Mark3Icon } from '@otmetki/icons';
import { BellRing, Crown, Gamepad2, Star } from 'lucide-react';

import type { SiteNavLink } from '@/shared/constants';

export const LOGIN_BENEFITS = [
  { key: 'favorites', icon: Star, tone: 'accent' },
  { key: 'goals', icon: Mark3Icon, tone: 'accent' },
  { key: 'mod', icon: Gamepad2, tone: 'accent' },
  { key: 'notifications', icon: BellRing, tone: 'accent' },
  { key: 'plus', icon: Crown, tone: 'gold' }
] as const satisfies readonly (Pick<SiteNavLink, 'icon' | 'key'> & { tone: 'accent' | 'gold' })[];
