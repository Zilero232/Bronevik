import type { ClanRole } from '@otmetki/schemas';

import { isIncludedIn } from 'remeda';

import { communityErrorKind } from '@/features/community/api-error';

import type { ViewerClanRoleInput, WorkspaceStatus, WorkspaceStatusInput } from './workspace-access.types';

import { WORKSPACE_ROLES } from '../../config';

export const isOfficerRole = (role: ClanRole | null): boolean => role !== null && isIncludedIn(role, WORKSPACE_ROLES.officers);

export const canOwnWorkspace = (role: ClanRole | null): boolean => role !== null && isIncludedIn(role, WORKSPACE_ROLES.owners);

export const viewerClanRole = ({ members, accountIds }: ViewerClanRoleInput): ClanRole | null => {
  const own = members.filter((member) => accountIds.includes(member.accountId));

  return (own.find((member) => isOfficerRole(member.role)) ?? own[0])?.role ?? null;
};

export const workspaceStatus = ({ isViewerPending, isSignedIn, clanRole, workspace, error }: WorkspaceStatusInput): WorkspaceStatus => {
  if (isViewerPending) {
    return 'pending';
  }

  if (!isSignedIn) {
    return 'guest';
  }

  if (workspace) {
    return 'ready';
  }

  if (clanRole === null) {
    return 'outsider';
  }

  if (!error) {
    return 'pending';
  }

  const kind = communityErrorKind(error);

  if (kind === 'notFound') {
    return 'missing';
  }

  return kind === 'forbidden' ? 'forbidden' : 'error';
};
