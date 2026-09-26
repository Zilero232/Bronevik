import type { OverlayConfig, OverlayKind, OverlayMetric } from '@bronevik/schemas';

export const OVERLAY_EDITOR = {
  maxMetrics: 8,
  previewDebounceMs: 450,
  previewHeight: 240,
  fontScale: { min: 0.5, max: 3, step: 0.1 },
  defaultAccent: '#ff6b1a',
  newId: 'new'
} as const;

export const OBS_STEPS = ['source', 'url', 'size', 'transparent'] as const;

export const KIND_PRESETS: Record<OverlayKind, readonly OverlayMetric[]> = {
  session: ['battles', 'winRate', 'avgDamage', 'wn8'],
  wn8: ['wn8', 'battles', 'winRate'],
  moe: ['moePercent', 'lastBattle'],
  damage: ['avgDamage', 'lastBattle'],
  win_rate: ['winRate', 'battles', 'winStreak'],
  win_streak: ['winStreak', 'winRate'],
  challenge: ['battles'],
  custom: ['battles', 'winRate']
};

export const OBS_SIZE: Record<OverlayConfig['layout'], { width: number; height: number }> = {
  row: { width: 1280, height: 160 },
  column: { width: 360, height: 720 },
  grid: { width: 640, height: 360 }
};
