'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseUsageMeterInput } from './use-usage-meter.types';

import { getUsage } from '../../../api';

export const useUsageMeter = ({ meter, enabled = true }: UseUsageMeterInput) => {
  const { data, isPending } = useQuery({
    queryKey: QUERY_KEYS.me.usage,
    queryFn: ({ signal }) => getUsage(signal),
    enabled,
    staleTime: 0
  });

  const state = data?.meters.find((item) => item.meter === meter) ?? null;

  return {
    audience: data?.audience ?? null,
    resetsAt: data?.resetsAt ?? null,
    limit: state?.limit ?? null,
    used: state?.used ?? 0,
    remaining: state?.remaining ?? null,
    isUnlimited: state !== null && state.limit === null,
    isExhausted: state?.remaining === 0,
    isPending: enabled && isPending
  };
};
