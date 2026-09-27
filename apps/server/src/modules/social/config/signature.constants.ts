import type { RatingTier } from '@otmetki/schemas';

export const SIGNATURE = {
  width: 468,
  height: 100,
  cacheSeconds: 1800,
  cachePrefix: 'sig:v1:',
  fontFiles: { display: 'tektur-700.ttf', body: 'onest-500.ttf' },
  fontNames: { display: 'Tektur', body: 'Onest' },
  background: '#16181c',
  foreground: '#f3f1ea',
  muted: '#9aa0a6',
  accent: '#ff7a1a',
  brand: 'triotmetki.ru',
  locale: 'ru',
  missing: '—'
} as const;

export const TIER_COLORS = {
  very_bad: '#a3342f',
  bad: '#d14b2e',
  below_avg: '#e08a2c',
  avg: '#d8c23a',
  good: '#6fb33a',
  very_good: '#3a9a4a',
  great: '#3b8fd6',
  unicum: '#8a4fd6',
  super_unicum: '#5a2aa6'
} as const satisfies Record<RatingTier, string>;
