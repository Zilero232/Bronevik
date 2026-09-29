import type { ClanMember } from '@otmetki/schemas';

import type { ClanWorkspace, WorkspaceScope } from '../../../api';
import type { WORKSPACE_TABS } from '../../../config';

type WorkspaceTab = (typeof WORKSPACE_TABS)[number];

export type WorkspaceTabsProps = WorkspaceScope & {
  workspace: ClanWorkspace;
  members: readonly ClanMember[];
  isOfficer: boolean;
  recruits: number;
  tab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
};
