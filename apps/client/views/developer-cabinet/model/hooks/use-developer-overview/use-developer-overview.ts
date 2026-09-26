'use client';

import { useQuery } from '@tanstack/react-query';

import { getDeveloperOverview } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useDeveloperOverview = () => useQuery({ queryKey: QUERY_KEYS.me.developer.overview, queryFn: getDeveloperOverview });
