export const HUD_OVERLAY = {
  grid: 1,
  unit: 'rem',
  defaultScreen: { width: 1920, height: 1080 },
  screenCheckMs: 1000,
  hoverPollMs: 50,
  clickSlop: 5,
  buttonSize: 36,
  buttonIcon: 'icon.png',
  scaleOrigin: '0 0',
  hidden: 0,
  emptyRect: { left: 0, top: 0, width: 0, height: 0 },
  dock: { gap: 6, reserve: 190, ceiling: 80 },
  hintGap: 6,
  fullStats: { width: 1240, top: 80, bottom: 150, alpha: 0.2 }
} as const;
