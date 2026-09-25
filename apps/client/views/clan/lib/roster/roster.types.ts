import type { ClanMember } from '@bronevik/schemas';

import type { INACTIVE_FILTERS, ROLE_FILTERS, ROLE_GROUP_KEYS } from '../../config';
import type { ActivityStatus } from '../activity-status';

export type RoleGroup = (typeof ROLE_GROUP_KEYS)[number];

export type RoleFilter = (typeof ROLE_FILTERS)[number];

export type InactiveFilter = (typeof INACTIVE_FILTERS)[number];

export type RosterRow = ClanMember & {
  daysInClan: number | null;
  status: ActivityStatus;
};

export type ToRosterRowsInput = {
  members: readonly ClanMember[];
  now: string;
};

export type FilterRosterInput = {
  rows: readonly RosterRow[];
  role: RoleFilter;
  inactive: InactiveFilter;
};
