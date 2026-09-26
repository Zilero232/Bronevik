'use client';

import { useQuery } from '@tanstack/react-query';

import { getReplay } from '@/entities/replay/replay';
import { QUERY_KEYS } from '@/shared/constants';

import { REPLAY_PAGE } from '../../../config';
import { isReplayPending } from '../../../lib/replay-state';

export const useReplayPage = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.replays.detail(id),
    queryFn: ({ signal }) => getReplay({ id, signal }),
    refetchInterval: (query) => (isReplayPending(query.state.data?.status) ? REPLAY_PAGE.pollIntervalMs : false)
  });
