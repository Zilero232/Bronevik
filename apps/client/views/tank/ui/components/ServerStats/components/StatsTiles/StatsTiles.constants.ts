import { Eye, Flame, Scale, Shield, Skull, Swords, Trophy, Users } from 'lucide-react';

import { ratingTone } from '@/shared/lib';

import type { StatTileConfig } from './StatsTiles.types';

const COMPACT: Intl.NumberFormatOptions = { notation: 'compact', maximumFractionDigits: 1 };

export const STAT_TILES: readonly StatTileConfig[] = [
  {
    key: 'winRate',
    icon: Trophy,
    unit: 'percent',
    format: { maximumFractionDigits: 2 },
    pick: (row) => row.winRate,
    tone: (row) => ratingTone({ scale: 'winRate', value: row.winRate }),
    trend: (point) => point.winRate
  },
  {
    key: 'winRateDiff',
    icon: Scale,
    unit: 'pp',
    format: { maximumFractionDigits: 2, signDisplay: 'exceptZero' },
    pick: (row) => row.winRateDiff,
    tone: (row) => (row.winRateDiff >= 0 ? 'good' : 'bad')
  },
  {
    key: 'avgDamage',
    icon: Flame,
    format: { maximumFractionDigits: 0 },
    pick: (row) => row.avgDamage,
    tone: () => 'accent',
    trend: (point) => point.avgDamage
  },
  { key: 'avgFrags', icon: Skull, format: { maximumFractionDigits: 2 }, pick: (row) => row.avgFrags, tone: () => 'accent' },
  { key: 'avgSpotted', icon: Eye, format: { maximumFractionDigits: 2 }, pick: (row) => row.avgSpotted, tone: () => 'steel' },
  {
    key: 'survivalRate',
    icon: Shield,
    unit: 'percent',
    format: { maximumFractionDigits: 1 },
    pick: (row) => row.survivalRate,
    tone: () => 'steel'
  },
  { key: 'battles', icon: Swords, format: COMPACT, pick: (row) => row.battles, tone: () => 'steel', trend: (point) => point.battles },
  { key: 'players', icon: Users, format: COMPACT, pick: (row) => row.players, tone: () => 'steel', trend: (point) => point.players }
];
