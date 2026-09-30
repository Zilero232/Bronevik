export const HUD_OVERLAY = {
  grid: 1,
  unit: 'rem',
  defaultScreen: { width: 1920, height: 1080 },
  screenCheckMs: 1000,
  clickSlop: 3,
  buttonSize: 36,
  buttonIcon: 'icon.png',
  scaleOrigin: '0 0',
  hidden: 0,
  dock: { gap: 6, reserve: 190, ceiling: 80 }
} as const;
