import type { CrewRoleUsage } from '@otmetki/schemas';

import type { CREW_ROLE_ORDER, SHELL_KINDS } from '../../config';

export type ShellKindKey = 'unknown' | (typeof SHELL_KINDS)[number];

export type OrderCrewInput = {
  crew: readonly CrewRoleUsage[];
  skillsPerRole: number;
};

export type CrewRoleKey = (typeof CREW_ROLE_ORDER)[number];

export type OrderedCrewRole = Omit<CrewRoleUsage, 'role'> & {
  role: CrewRoleKey;
};
