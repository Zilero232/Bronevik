import type { ClanMember, ClanRole } from '@otmetki/schemas';

import type { ClanWorkspace } from '../../api';

export type WorkspaceStatus = 'error' | 'forbidden' | 'guest' | 'missing' | 'outsider' | 'pending' | 'ready';

export type ViewerClanRoleInput = {
  members: readonly Pick<ClanMember, 'accountId' | 'role'>[];
  accountIds: readonly number[];
};

export type WorkspaceStatusInput = {
  isViewerPending: boolean;
  isSignedIn: boolean;
  clanRole: ClanRole | null;
  workspace: ClanWorkspace | undefined;
  error: unknown;
};
