import type { RatingTone } from '@/shared/lib';

export const OG_SIZE = {
  width: 1200,
  height: 630
} as const;

export const OG_COLORS = {
  bg: '#0b0d0f',
  surface: '#121519',
  border: '#242a31',
  text: '#ebe6dc',
  muted: '#8f959e',
  dim: '#5f656e',
  accent: '#ff6b1a',
  accentHot: '#ffb347',
  steel: '#7aa5cc'
} as const;

export const OG_TONES: Record<RatingTone, string> = {
  bad: '#e5484d',
  below: '#ff8b3d',
  average: '#f2c94c',
  good: '#4cc36b',
  great: '#3fa9f5',
  unicum: '#b16cff'
};

export const OG_FONTS = {
  display: 'Tektur',
  body: 'Onest'
} as const;
