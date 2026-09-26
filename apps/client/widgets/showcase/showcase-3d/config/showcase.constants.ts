export const SHOWCASE_CANVAS = {
  dpr: [1, 1.5],
  fov: 28,
  near: 0.1,
  far: 400,
  distanceFactor: 2.6,
  elevation: 0.34,
  targetLift: 0.1,
  narrowAspect: 1.5
} as const;

export const SHOWCASE_MOTION = {
  spinPerSecond: 0.16,
  initialYaw: -0.6,
  parallaxYaw: 0.18,
  parallaxPitch: 0.06,
  parallaxDamping: 4,
  dragFactor: 0.008,
  dragFollow: 12,
  dragIgnore: 'a, button',
  revealSeconds: 1.1,
  scanPeriodSeconds: 5.5,
  turretPeriodSeconds: 11
} as const;

export const TURRET_SWEEP = {
  lightTank: 0.55,
  mediumTank: 0.5,
  heavyTank: 0.42,
  'AT-SPG': 0.1,
  SPG: 0.08
} as const;

export const SHOWCASE_ROTATION = {
  intervalMs: 9000,
  fadeSeconds: 0.35
} as const;

export const HOLOGRAM_COLORS = {
  fill: '#1b1b1f',
  light: '#4a4a55',
  edge: '#9d9daa',
  accent: '#ff7a1a',
  rim: '#ffd2a8',
  grid: '#2c2c32',
  gridSection: '#3a3a42'
} as const;

export const HOLOGRAM_SHADING = {
  fillAlpha: 0.78,
  edgeAlpha: 0.62,
  rimStrength: 0.55,
  scanWidth: 0.05,
  scanStrength: 0.55,
  scanlineStrength: 0.05,
  edgeThresholdDegrees: 28,
  shadowAlpha: 0.55
} as const;

export const FLOOR_GRID = {
  cellSize: 0.5,
  sectionSize: 2.5,
  thickness: 0.6,
  sectionThickness: 0.9,
  sizeFactor: 8,
  fadeFactor: 4.4,
  fadeStrength: 1.5,
  shadowFactor: 1.35
} as const;

export const LOW_POWER = {
  maxCores: 4,
  maxMemoryGb: 2
} as const;
