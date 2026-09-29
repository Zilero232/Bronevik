import type { VehicleStats } from '@otmetki/schemas';

import type { TankSpecKey } from '../../model/tank-specs.types';
import type { TankSpecs } from '../../model/tank.types';

import { TANK_SPEC_KEYS } from '../../config';
import { SPEC_PATH, SPEC_PROFILES, SPEC_READERS } from './vehicle-specs.constants';

export const specPath = (key: TankSpecKey): string => SPEC_PATH[key] ?? key;

export const specsOfStats = (stats: VehicleStats | null | undefined): TankSpecs =>
  stats ? Object.fromEntries(TANK_SPEC_KEYS.map((key) => [key, SPEC_READERS[key](stats)])) : {};

export const specsOfFlat = (flat: Readonly<Record<string, number | null>>): TankSpecs =>
  Object.fromEntries(TANK_SPEC_KEYS.map((key) => [key, flat[specPath(key)] ?? null]));

export const specKeyOfPath = (path: string): TankSpecKey | undefined => {
  const [head, ...rest] = path.split('.');
  const inner = head !== undefined && SPEC_PROFILES.has(head) ? rest.join('.') : path;

  return TANK_SPEC_KEYS.find((key) => specPath(key) === inner);
};
