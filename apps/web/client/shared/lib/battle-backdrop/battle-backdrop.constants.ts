export const BATTLE_BACKDROP = {
  density: {
    low: { dust: 24, smoke: 3, cols: 36, rows: 14 },
    normal: { dust: 44, smoke: 5, cols: 48, rows: 18 }
  },
  levels: [0.3, 0.38, 0.46, 0.54, 0.62, 0.7],
  octaves: [
    { step: 8, weight: 0.65 },
    { step: 3, weight: 0.35 }
  ],
  contourAlpha: 0.09,
  contourWidth: 1,
  dpr: 1.5,
  fps: 30,
  maxStepSeconds: 0.1,
  tracerSeed: { multiplier: 7919, offset: 17 },
  mote: {
    smoke: { radius: [0.12, 0.14], vx: [0.004, 0.004], vy: [0.002, 0.002], alpha: [0.025, 0.03] },
    dust: { radius: [0.0008, 0.0016], vx: [0.008, 0.012], vy: [0.002, 0.008], alpha: [0.08, 0.16] },
    minRadiusPx: 0.6
  },
  tracer: {
    life: 0.7,
    width: 1.25,
    alpha: 0.5,
    minGap: 3.5,
    maxGap: 8,
    leftChance: 0.5,
    startY: [0.15, 0.7],
    drift: 0.35,
    overshoot: 0.05,
    tail: [0.08, 0.06]
  }
} as const;
