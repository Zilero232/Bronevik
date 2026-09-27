import type { ClanRole } from '../../../../generated';

export const WORKSPACE_ROLES = {
  owners: ['commander', 'executiveOfficer'] as const satisfies readonly ClanRole[],
  officers: [
    'commander',
    'executiveOfficer',
    'personnelOfficer',
    'combatOfficer',
    'intelligenceOfficer',
    'quartermaster',
    'recruitmentOfficer',
    'juniorOfficer'
  ] as const satisfies readonly ClanRole[]
} as const;
