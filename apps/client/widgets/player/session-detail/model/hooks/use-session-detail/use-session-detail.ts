'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlayerSession } from '@/entities/player/profile';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseSessionDetailInput } from './use-session-detail.types';

export const useSessionDetail = ({ accountId, sessionId }: UseSessionDetailInput) =>
  useQuery({
    queryKey: QUERY_KEYS.player.section({ accountId, section: 'session', params: { sessionId } }),
    queryFn: ({ signal }) => getPlayerSession({ accountId, sessionId, signal })
  });
