import type { TankClass } from '@otmetki/icons';
import type { TankRole } from '@otmetki/schemas';

import { TANK_ROLES } from '@otmetki/schemas';

import { ROLE_CLASS_PREFIX } from '../../config';

export const rolesForTypes = (types: readonly TankClass[]): TankRole[] =>
  types.length === 0 ? [...TANK_ROLES] : TANK_ROLES.filter((role) => types.some((type) => role.startsWith(ROLE_CLASS_PREFIX[type])));
