import type { ClanRole } from '@otmetki/schemas';

import { parseAsStringLiteral } from 'nuqs';

export const WORKSPACE_TABS = ['overview', 'events', 'roster', 'candidates'] as const;

export const WORKSPACE_TAB_PARSER = parseAsStringLiteral(WORKSPACE_TABS).withDefault('overview').withOptions({ history: 'replace' });

export const WORKSPACE_ROLES = {
  owners: ['commander', 'executive_officer'],
  officers: [
    'commander',
    'executive_officer',
    'personnel_officer',
    'combat_officer',
    'intelligence_officer',
    'quartermaster',
    'recruitment_officer',
    'junior_officer'
  ]
} as const satisfies Record<string, readonly ClanRole[]>;

export const WORKSPACE_VIEW = {
  staleMs: 60_000,
  historyDays: 30,
  skeletonHeight: 360,
  percentScale: 100,
  attendanceGood: 0.75,
  attendanceBad: 0.4
} as const;
