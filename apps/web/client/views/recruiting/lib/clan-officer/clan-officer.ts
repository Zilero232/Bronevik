import type { ViewerClanMembership } from './clan-officer.types';

import { RECRUITING_OFFICER_ROLES } from '../../config';

const OFFICER_ROLES: ReadonlySet<string> = new Set(RECRUITING_OFFICER_ROLES);

export const isRecruitingOfficer = (role: string | null | undefined): boolean => role !== null && role !== undefined && OFFICER_ROLES.has(role);

export const officerMemberships = (memberships: readonly ViewerClanMembership[]): ViewerClanMembership[] =>
  memberships.filter(({ role }) => isRecruitingOfficer(role));
