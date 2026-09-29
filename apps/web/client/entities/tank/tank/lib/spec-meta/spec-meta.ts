import { isIncludedIn } from 'remeda';

import type { TankSpecMeta } from '../../model/tank-specs.types';

import { TANK_SPEC_KEYS, TANK_SPECS } from '../../config';

export const specMeta = (key: string): TankSpecMeta | undefined => (isIncludedIn(key, TANK_SPEC_KEYS) ? TANK_SPECS[key] : undefined);
