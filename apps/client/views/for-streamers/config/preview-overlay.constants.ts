import type { OverlayConfig } from '@otmetki/schemas';

export const PREVIEW_OVERLAY_CONFIG: OverlayConfig = {
  theme: 'steel',
  layout: 'grid',
  metrics: ['battles', 'winRate', 'avgDamage', 'wn8', 'moePercent', 'lastBattle'],
  fontScale: 1,
  animate: false,
  showTank: true,
  resetAt: 'session',
  locale: 'ru'
};

export const PREVIEW_OVERLAY = {
  leaderboard: { scope: 'players', metric: 'wn8', period: '7d', limit: 1 },
  sessions: { limit: 1, offset: 0 },
  recentPeriods: ['24h', '7d'],
  marks: [
    { percent: 95, marks: 3 },
    { percent: 85, marks: 2 },
    { percent: 65, marks: 1 }
  ]
} as const;
