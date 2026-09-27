import type { NudgeSteps } from './geometry.types';

const NUDGE: NudgeSteps = {
  ArrowLeft: { dx: -4, dy: 0 },
  ArrowRight: { dx: 4, dy: 0 },
  ArrowUp: { dx: 0, dy: -4 },
  ArrowDown: { dx: 0, dy: 4 }
};

export const GEOMETRY = {
  grid: 4,
  defaultScreen: { width: 1920, height: 1080 },
  moveThrottleMs: 150,
  nudge: NUDGE
} as const;
