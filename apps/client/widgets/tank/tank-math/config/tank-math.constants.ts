import type { HandlingScenario, SpottingVerdict } from '@otmetki/gamedata';

import type { BadgeTone, ProgressTone } from '@/ui-kit';

export const TANK_MATH_PRESETS = ['top', 'stock'] as const;

export const HANDLING_ROWS = ['score', 'aimingTime', 'dispersion', 'aim.move', 'aim.hull', 'aim.turret', 'aim.shot', 'aim.full'] as const;

export const TANK_MATH_SIDES = ['me', 'them'] as const;

export const SPOTTING_SWITCHES = [
  { group: 'state', keys: ['isMoving', 'isFiring', 'isFoliageNear'] },
  { group: 'camouflage', keys: ['hasCamoNet', 'hasPaint'] },
  { group: 'vision', keys: ['hasOptics', 'hasBinoculars', 'hasCrewSkills'] }
] as const;

export const TANK_MATH = {
  staleMs: 3_600_000,
  chartHeight: 240,
  skeletonHeight: 320,
  flightDistance: 300,
  penetrationDistances: [100, 300, 500],
  camoSkill: { min: 0, max: 100, step: 5 }
} as const;

export const SCENARIO_TONES = {
  move: 'accent',
  hull: 'good',
  turret: 'great',
  shot: 'below',
  full: 'bad'
} as const satisfies Record<HandlingScenario, ProgressTone>;

export const SHELL_TONES = ['accent', 'great', 'below', 'good', 'unicum', 'steel'] as const satisfies readonly ProgressTone[];

export const VERDICT_TONES = {
  me: 'success',
  them: 'danger',
  even: 'neutral'
} as const satisfies Record<SpottingVerdict, BadgeTone>;

export const TANK_MATH_FORMAT = {
  meters: { maximumFractionDigits: 0 },
  dispersion: { minimumFractionDigits: 2, maximumFractionDigits: 3 },
  seconds: { maximumFractionDigits: 2 },
  percent: { style: 'percent', maximumFractionDigits: 1 },
  signedMeters: { signDisplay: 'exceptZero', maximumFractionDigits: 0 }
} as const satisfies Record<string, Intl.NumberFormatOptions>;
