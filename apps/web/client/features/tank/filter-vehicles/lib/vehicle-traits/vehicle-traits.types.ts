import type { TankClass } from '@otmetki/icons';
import type { TankRole } from '@otmetki/schemas';

export type RolesWithinTypesInput = {
  roles: readonly TankRole[];
  types: readonly TankClass[];
};
