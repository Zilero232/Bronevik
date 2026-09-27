import type { ClanRole } from '@otmetki/schemas';

import { parseAsStringLiteral } from 'nuqs';

export const ROLE_GROUP_KEYS = ['command', 'officers', 'soldiers', 'reserve'] as const;

export const ROLE_GROUPS: Record<(typeof ROLE_GROUP_KEYS)[number], readonly ClanRole[]> = {
  command: ['commander', 'executive_officer'],
  officers: ['personnel_officer', 'combat_officer', 'intelligence_officer', 'quartermaster', 'recruitment_officer', 'junior_officer'],
  soldiers: ['private', 'recruit'],
  reserve: ['reservist']
};

export const ROLE_FILTERS = ['all', ...ROLE_GROUP_KEYS] as const;

export const INACTIVE_FILTERS = ['all', '7', '14', '30'] as const;

export const ROSTER_FILTER_PARSERS = {
  role: parseAsStringLiteral(ROLE_FILTERS).withDefault('all'),
  idle: parseAsStringLiteral(INACTIVE_FILTERS).withDefault('all')
} as const;
