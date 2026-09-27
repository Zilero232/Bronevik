export const BATTLE_BACKDROP = {
  density: {
    low: { dust: 24, smoke: 3, cols: 36, rows: 14 },
    normal: { dust: 44, smoke: 5, cols: 48, rows: 18 }
  },
  levels: [0.3, 0.38, 0.46, 0.54, 0.62, 0.7],
  contourAlpha: 0.09,
  contourWidth: 1,
  dpr: 1.5,
  fps: 30,
  tracer: { life: 0.7, width: 1.25, alpha: 0.5, minGap: 3.5, maxGap: 8 }
} as const;
