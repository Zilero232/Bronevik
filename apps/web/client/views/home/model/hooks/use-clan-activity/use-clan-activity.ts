'use client';

import { useQuery } from '@tanstack/react-query';

import { listClans } from '@/entities/clan/clan';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useClanActivity = () =>
  useQuery({
    queryKey: QUERY_KEYS.clans.list(HOME.clans),
    queryFn: ({ signal }) => listClans({ ...HOME.clans, signal }),
    select: ({ items }) => items
  });
