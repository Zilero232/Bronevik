import type { MasteryLevel } from '@otmetki/icons';

export const TANK_PAGE = {
  trendDays: 60,
  topLimit: 10,
  skeletonRows: 5,
  skeletonBuilds: 3,
  chartHeight: 200,
  rowHeight: 36,
  podium: 3
} as const;

export const TANK_SECTIONS = {
  stats: 'stats',
  marks: 'marks',
  mastery: 'mastery',
  players: 'players',
  builds: 'builds',
  patches: 'patches'
} as const;

export const TOP_METRICS = ['wn8', 'avgDamage', 'winRate'] as const;

export const BREAKDOWN_COHORTS = ['beginner', 'average', 'good', 'elite'] as const;

export const MASTERY_LEVELS = [
  { key: 'class3', level: 'third' },
  { key: 'class2', level: 'second' },
  { key: 'class1', level: 'first' },
  { key: 'master', level: 'master' }
] as const satisfies readonly { key: string; level: MasteryLevel }[];
