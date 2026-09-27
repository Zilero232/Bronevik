import type { ClanRole } from '../../../../generated';

export const RECRUITING = {
  defaultDays: 14,
  maxDays: 60,
  officerRoles: ['commander', 'executiveOfficer', 'personnelOfficer', 'recruitmentOfficer', 'combatOfficer'] as const satisfies readonly ClanRole[]
} as const;
