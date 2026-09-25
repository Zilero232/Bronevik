import type { VehicleStats } from '@bronevik/schemas';

import type { TankSpecKey } from '../../config';

export const SPEC_PATH: Partial<Record<TankSpecKey, string>> = {
  shellDamage: 'shells.0.damage',
  shellPenetration: 'shells.0.penetration100m',
  damagePerMinute: 'shells.0.damagePerMinute'
};

export const SPEC_PROFILES: ReadonlySet<string> = new Set(['stock', 'top']);

export const SPEC_READERS: Record<TankSpecKey, (stats: VehicleStats) => number | null> = {
  shellDamage: ({ shell }) => shell?.damage ?? null,
  shellPenetration: ({ shell }) => shell?.penetration100m ?? null,
  damagePerMinute: ({ shell }) => shell?.damagePerMinute ?? null,
  reloadTime: ({ reloadTime }) => reloadTime,
  rateOfFire: ({ rateOfFire }) => rateOfFire,
  aimingTime: ({ aimingTime }) => aimingTime,
  dispersion: ({ dispersion }) => dispersion,
  dispersionMovement: ({ dispersionMovement }) => dispersionMovement,
  depression: ({ depression }) => depression,
  maxHealth: ({ maxHealth }) => maxHealth,
  weight: ({ weight }) => weight,
  enginePower: ({ enginePower }) => enginePower,
  powerToWeight: ({ powerToWeight }) => powerToWeight,
  speedForward: ({ speedForward }) => speedForward,
  speedBackward: ({ speedBackward }) => speedBackward,
  hullTraverse: ({ hullTraverse }) => hullTraverse,
  turretTraverse: ({ turretTraverse }) => turretTraverse,
  viewRange: ({ viewRange }) => viewRange,
  radioRange: ({ radioRange }) => radioRange
};
