'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyBattle } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';

export const useMyBattle = (id: string) =>
  useQuery({ queryKey: QUERY_KEYS.me.analytics.battle(id), queryFn: ({ signal }) => getMyBattle({ id, signal }) });
