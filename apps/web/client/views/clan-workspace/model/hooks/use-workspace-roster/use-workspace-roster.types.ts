import type { ClanMember } from '@otmetki/schemas';

import type { WorkspaceScope } from '../../../api';
import type { MemberAttendance } from '../../../lib/attendance';

export type UseWorkspaceRosterInput = WorkspaceScope & {
  members: readonly ClanMember[];
};

export type WorkspaceRosterRow = ClanMember &
  MemberAttendance & {
    isOfficer: boolean;
  };
