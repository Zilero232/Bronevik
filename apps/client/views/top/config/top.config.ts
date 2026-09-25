import type { LeaderboardScope, RatingKind, RatingPeriod } from '@bronevik/schemas';
import type { ComponentType } from 'react';

import { Mark3Icon } from '@bronevik/icons';
import { Radio, Shield, TrendingUp, Users } from 'lucide-react';

export const TOP_SCOPES: readonly LeaderboardScope[] = ['players', 'clans', 'risingStars', 'marks', 'streamers'];

export const TOP_SCOPE_ICONS: Record<LeaderboardScope, ComponentType<{ size?: number | string }>> = {
  players: Users,
  clans: Shield,
  risingStars: TrendingUp,
  marks: Mark3Icon,
  streamers: Radio
};

export const TOP_METRICS: Record<LeaderboardScope, readonly RatingKind[]> = {
  players: ['wn8', 'broneIndex', 'eff', 'winRate', 'avgDamage'],
  clans: ['wn8', 'winRate'],
  risingStars: ['wn8', 'broneIndex', 'winRate', 'avgDamage'],
  marks: [],
  streamers: ['wn8', 'broneIndex', 'winRate', 'avgDamage']
};

export const TOP_PERIODS: readonly RatingPeriod[] = ['overall', '24h', '7d', '30d', '60d', '1000'];

export const TOP_TANK_SCOPES: readonly LeaderboardScope[] = ['players', 'streamers'];

export const PODIUM_SIZE = 3;
