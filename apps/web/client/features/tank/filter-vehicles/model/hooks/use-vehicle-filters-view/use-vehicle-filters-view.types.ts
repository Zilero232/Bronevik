import type { TankRole } from '@otmetki/schemas';

import type { ANY_ROLE } from '../../../config';

export type RoleChoice = TankRole | typeof ANY_ROLE;
