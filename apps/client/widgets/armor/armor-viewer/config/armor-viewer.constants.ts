import type { OrbitKeyStep } from './armor-viewer.types';

export const VIEW_PRESETS = ['front', 'side', 'rear', 'top'] as const;

export const PRESET_DIRECTIONS = {
  front: [0, 0.3, 1],
  side: [1, 0.25, 0],
  rear: [0, 0.3, -1],
  top: [0, 1, 0.02],
  initial: [0.85, 0.45, 1]
} as const;

export const ARMOR_CAMERA = {
  fov: 32,
  near: 0.05,
  far: 200,
  distanceFactor: 2.3,
  transitionSeconds: 0.6,
  keyboardStepDegrees: 15,
  zoomFactor: 0.88,
  minPolar: 0.05,
  minRadius: 1,
  maxRadiusFactor: 8
} as const;

export const ARMOR_CANVAS = {
  dpr: [1, 2],
  screenshotName: 'armor',
  homeKey: 'Home',
  tooltipFlipMargin: 260
} as const;

export const ARMOR_COLOR_UNIFORMS = {
  uPen: 'pen',
  uChance: 'chance',
  uNoPen: 'noPen',
  uRicochetColor: 'ricochet',
  uSpaced: 'spaced',
  uModule: 'module',
  uHollow: 'hollow'
} as const;

const KEY_STEP = (ARMOR_CAMERA.keyboardStepDegrees * Math.PI) / 180;

export const ORBIT_KEYS: Readonly<Record<string, OrbitKeyStep>> = {
  ArrowLeft: { azimuth: -KEY_STEP },
  ArrowRight: { azimuth: KEY_STEP },
  ArrowUp: { polar: -KEY_STEP },
  ArrowDown: { polar: KEY_STEP },
  '+': { zoom: ARMOR_CAMERA.zoomFactor },
  '=': { zoom: ARMOR_CAMERA.zoomFactor },
  '-': { zoom: 1 / ARMOR_CAMERA.zoomFactor }
};

export const NO_SHELL = {
  shell: { kind: 'ARMOR_PIERCING', caliber: 0, penetration: 0 },
  randomness: 0
} as const;
