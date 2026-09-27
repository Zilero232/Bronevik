import type { ClanMember } from '@otmetki/schemas';

import type { ClanWorkspace, WorkspaceScope } from '../../../api';

export type WorkspaceOverviewProps = WorkspaceScope & {
  workspace: ClanWorkspace;
  isOfficer: boolean;
  members: readonly ClanMember[];
};
