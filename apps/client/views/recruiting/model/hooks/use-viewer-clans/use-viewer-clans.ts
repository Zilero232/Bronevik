'use client';

import type { QueryFunctionContext } from '@tanstack/react-query';

import { useQueries } from '@tanstack/react-query';

import { useCommunityViewer } from '@/features/community/viewer';
import { getPlayer } from '@/shared/api/players';
import { QUERY_KEYS } from '@/shared/constants';

import type { ViewerClanMembership } from '../../../lib/clan-officer';

import { officerMemberships } from '../../../lib/clan-officer';

export const useViewerClans = () => {
  const { accounts, isPending: isViewerPending } = useCommunityViewer();
  const profiles = useQueries({
    queries: accounts.map(({ accountId }) => ({
      queryKey: QUERY_KEYS.player.profile(String(accountId)),
      queryFn: ({ signal }: QueryFunctionContext) => getPlayer({ idOrNick: String(accountId), signal })
    }))
  });

  const memberships: ViewerClanMembership[] = profiles.flatMap(({ data }) => {
    const clan = data?.summary.clan;

    return data && clan
      ? [{ accountId: data.summary.accountId, nickname: data.summary.nickname, clanId: clan.clanId, clanTag: clan.tag, role: clan.role }]
      : [];
  });

  const officers = officerMemberships(memberships);

  return {
    memberships,
    officers,
    isPending: isViewerPending || profiles.some(({ isPending }) => isPending),
    isOfficerOf: (clanId: number | null) => clanId !== null && officers.some((membership) => membership.clanId === clanId)
  };
};
