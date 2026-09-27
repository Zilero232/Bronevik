'use client';

import { useQuery } from '@tanstack/react-query';
import { sumBy } from 'remeda';

import { useAuthSession } from '@/entities/auth/session';
import { getMissionCampaigns, missionQueries } from '@/entities/mission/mission';
import { QUERY_KEYS } from '@/shared/constants';

import { operationProgress } from '../../../lib/operation-progress';

export const useMissionsHub = () => {
  const { data: session } = useAuthSession();
  const campaigns = useQuery({ queryKey: QUERY_KEYS.missions.campaigns, queryFn: ({ signal }) => getMissionCampaigns({ signal }) });
  const progress = useQuery(missionQueries.progress(Boolean(session)));

  const isSignedIn = Boolean(session);
  const items = progress.data?.items ?? [];

  return {
    campaigns,
    operationsCount: campaigns.data ? sumBy(campaigns.data.campaigns, (campaign) => campaign.operations.length) : null,
    progressOf: (questIds: readonly number[]) => (isSignedIn ? operationProgress({ questIds, items }) : null)
  };
};
