'use client';

import { useCommunityViewer } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';

import type { UseWorkspaceLinkInput } from './use-workspace-link.types';

export const useWorkspaceLink = ({ clan, members }: UseWorkspaceLinkInput) => {
  const { ownsAccount } = useCommunityViewer();

  return members.some((member) => ownsAccount(member.accountId)) ? ROUTES.clans.workspace(clan.tag) : null;
};
