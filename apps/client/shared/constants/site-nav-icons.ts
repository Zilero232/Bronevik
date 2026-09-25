import type { ComponentType } from 'react';

import { HeavyTankIcon, Mark3Icon, StrongholdIcon } from '@bronevik/icons';
import { Code2, Radio, Trophy, Users, Wrench } from 'lucide-react';

import type { SiteNavKey } from './site-nav';

export type SiteNavIcon = ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;

export const SITE_NAV_ICONS: Record<SiteNavKey, SiteNavIcon> = {
  players: Users,
  tanks: HeavyTankIcon,
  marks: Mark3Icon,
  top: Trophy,
  clans: StrongholdIcon,
  tools: Wrench,
  streamers: Radio,
  developers: Code2
};
