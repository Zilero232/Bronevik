'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { sum } from 'remeda';
import { toast } from 'sonner';

import { useCommunityViewer, useLoginHref } from '@/entities/auth/session';
import { communityErrorKind } from '@/features/community/api-error';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { createWorkspace, workspaceQueries } from '../../../api';
import { WORKSPACE_TAB_PARSER } from '../../../config';
import { canOwnWorkspace, viewerClanRole, workspaceStatus } from '../../../lib/workspace-access';
import { useWorkspaceTab } from '../use-workspace-tab';

export const useClanWorkspace = (tag: string) => {
  const t = useTranslations('clanWorkspace');
  const queryClient = useQueryClient();
  const viewer = useCommunityViewer();
  const loginHref = useLoginHref();
  const [tab, setTab] = useWorkspaceTab();
  const clan = useQuery({ ...workspaceQueries.clan(tag), retry: (failures, error) => !isNotFoundError(error) && failures < 1 });
  const clanId = clan.data?.clan.clanId ?? 0;
  const clanRole = viewerClanRole({ members: clan.data?.members ?? [], accountIds: viewer.accounts.map(({ accountId }) => accountId) });
  const workspace = useQuery({
    ...workspaceQueries.workspace(clanId),
    enabled: clanId > 0 && viewer.isSignedIn && clanRole !== null,
    retry: false
  });

  const create = useMutation({
    mutationFn: () => createWorkspace({ clanId }),
    onSuccess: async (created) => {
      queryClient.setQueryData(QUERY_KEYS.clanWorkspace.workspace(clanId), created);
      toast.success(t('missing.created'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clanWorkspace.all(clanId) });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const isOfficer = workspace.data?.role === 'officer';

  return {
    clan,
    workspace: workspace.data ?? null,
    status: workspaceStatus({
      isViewerPending: viewer.isPending,
      isSignedIn: viewer.isSignedIn,
      clanRole,
      workspace: workspace.data,
      error: workspace.error
    }),
    isOfficer,
    recruits: sum(Object.values(workspace.data?.candidates ?? {})),
    canCreate: canOwnWorkspace(clanRole),
    isCreating: create.isPending,
    isRetrying: workspace.isFetching,
    loginHref,
    tab: tab === 'candidates' && !isOfficer ? WORKSPACE_TAB_PARSER.defaultValue : tab,
    onTabChange: (next: typeof tab) => void setTab(next),
    onCreate: () => create.mutate(),
    onRetry: () => void workspace.refetch()
  };
};
