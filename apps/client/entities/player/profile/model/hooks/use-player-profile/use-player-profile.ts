'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlayer } from '../../../api';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

const RETRY_LIMIT = 1;

export const usePlayerProfile = (idOrNick: string) =>
  useQuery({
    queryKey: QUERY_KEYS.player.profile(idOrNick),
    queryFn: ({ signal }) => getPlayer({ idOrNick, signal }),
    retry: (failures, error) => !isNotFoundError(error) && failures < RETRY_LIMIT
  });
