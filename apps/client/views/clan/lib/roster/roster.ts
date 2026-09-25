import type { ClanRole } from '@bronevik/schemas';

import { differenceInCalendarDays, parseISO } from 'date-fns';

import type { FilterRosterInput, RoleGroup, RosterRow, ToRosterRowsInput } from './roster.types';

import { ROLE_GROUP_KEYS, ROLE_GROUPS } from '../../config';
import { activityStatus } from '../activity-status';

export const roleGroup = (role: ClanRole): RoleGroup => ROLE_GROUP_KEYS.find((group) => ROLE_GROUPS[group].includes(role)) ?? 'soldiers';

export const toRosterRows = ({ members, now }: ToRosterRowsInput): RosterRow[] =>
  members.map((member) => ({
    ...member,
    daysInClan: member.joinedAt ? Math.max(0, differenceInCalendarDays(parseISO(now), parseISO(member.joinedAt))) : null,
    status: activityStatus(member.inactiveDays)
  }));

export const filterRoster = ({ rows, role, inactive }: FilterRosterInput): RosterRow[] =>
  rows.filter((row) => {
    const isRoleMatch = role === 'all' || roleGroup(row.role) === role;
    const isInactiveMatch = inactive === 'all' || (row.inactiveDays ?? Number.POSITIVE_INFINITY) >= Number(inactive);

    return isRoleMatch && isInactiveMatch;
  });
