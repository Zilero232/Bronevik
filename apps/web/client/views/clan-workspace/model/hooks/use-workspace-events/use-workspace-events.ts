'use client';

import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';

import { useClientNow } from '@/shared/lib';

import type { UseWorkspaceEventsInput } from './use-workspace-events.types';

import { workspaceQueries } from '../../../api';
import { WORKSPACE_VIEW } from '../../../config';
import { splitEvents } from '../../../lib/attendance';

export const useWorkspaceEvents = ({ clanId, isEnabled }: UseWorkspaceEventsInput) => {
  const now = useClientNow();
  const from = now ? subDays(now, WORKSPACE_VIEW.historyDays).toISOString() : undefined;
  const query = useQuery({ ...workspaceQueries.events({ clanId, from }), enabled: isEnabled && from !== undefined });

  const { data: events = [] } = query;

  return {
    query,
    events,
    ...splitEvents({ events, now })
  };
};
