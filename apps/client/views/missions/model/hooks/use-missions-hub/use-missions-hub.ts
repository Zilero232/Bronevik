'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getMissionCampaigns, getMissionProgress } from '@/shared/api/missions';
import { QUERY_KEYS } from '@/shared/constants';

import { operationProgress } from '../../../lib/operation-progress';

export const useMissionsHub = () => {
  const { data: session } = useAuthSession();
  const campaigns = useQuery({ queryKey: QUERY_KEYS.missions.campaigns, queryFn: ({ signal }) => getMissionCampaigns({ signal }) });
  const progress = useQuery({
    queryKey: QUERY_KEYS.missions.progress,
    queryFn: ({ signal }) => getMissionProgress({ signal }),
    enabled: Boolean(session),
    retry: false
  });

  const isSignedIn = Boolean(session);
  const items = progress.data?.items ?? [];

  return {
    data: campaigns.data,
    isPending: campaigns.isPending,
    isError: campaigns.isError,
    isRetrying: campaigns.isFetching,
    retry: () => void campaigns.refetch(),
    progressOf: (questIds: readonly number[]) => (isSignedIn ? operationProgress({ questIds, items }) : null)
  };
};
