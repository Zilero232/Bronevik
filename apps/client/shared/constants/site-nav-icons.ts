import type { ComponentType } from 'react';

import { GlobalMapIcon, HeavyTankIcon, Mark3Icon, RadioIcon, StrongholdIcon, TrainingIcon } from '@bronevik/icons';
import { Code2, Trophy, Users } from 'lucide-react';

import type { SiteNavKey } from './site-nav';

export type SiteNavIcon = ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;

export const SITE_NAV_ICONS: Record<SiteNavKey, SiteNavIcon> = {
  players: Users,
  tanks: HeavyTankIcon,
  marks: Mark3Icon,
  top: Trophy,
  clans: StrongholdIcon,
  maps: GlobalMapIcon,
  tools: TrainingIcon,
  streamers: RadioIcon,
  developers: Code2
};
