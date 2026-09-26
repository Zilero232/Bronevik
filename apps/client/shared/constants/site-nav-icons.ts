import { GlobalMapIcon, HeavyTankIcon, Mark3Icon, RadioIcon, StrongholdIcon, TrainingIcon } from '@bronevik/icons';
import { Code2, Trophy, Users } from 'lucide-react';

import type { SiteNavKey } from './site-nav';
import type { SiteNavIcon } from './site-nav.types';

export const SITE_NAV_ICONS = {
  players: Users,
  tanks: HeavyTankIcon,
  marks: Mark3Icon,
  top: Trophy,
  clans: StrongholdIcon,
  maps: GlobalMapIcon,
  tools: TrainingIcon,
  streamers: RadioIcon,
  developers: Code2
} as const satisfies Record<SiteNavKey, SiteNavIcon>;
