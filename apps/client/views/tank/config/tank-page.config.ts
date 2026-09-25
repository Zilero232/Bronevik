import type { MasteryLevel } from '@bronevik/icons';

export const TANK_PAGE = {
  trendDays: 60,
  topLimit: 10,
  skeletonTiles: 8,
  skeletonRows: 5
} as const;

export const TANK_SECTIONS = {
  stats: 'stats',
  marks: 'marks',
  players: 'players',
  builds: 'builds',
  patches: 'patches'
} as const;

export const TOP_METRICS = ['wn8', 'avgDamage', 'winRate'] as const;

export const BREAKDOWN_COHORTS = ['beginner', 'average', 'good', 'elite'] as const;

export const MOE_KEYS = ['p65', 'p85', 'p95', 'p100'] as const;

export const MOE_DELTA_DAYS = [7, 30] as const;

export const MASTERY_LEVELS = [
  { key: 'class3', level: 'third' },
  { key: 'class2', level: 'second' },
  { key: 'class1', level: 'first' },
  { key: 'master', level: 'master' }
] as const satisfies readonly { key: string; level: MasteryLevel }[];
