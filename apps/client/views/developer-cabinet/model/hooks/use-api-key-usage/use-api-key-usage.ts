'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { ApiKeyUsageInput } from '@/shared/api/developer';

import { getApiKeyUsage } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useApiKeyUsage = ({ id, days }: ApiKeyUsageInput) =>
  useQuery({
    queryKey: QUERY_KEYS.me.developer.usage({ id, days }),
    queryFn: () => getApiKeyUsage({ id, days }),
    enabled: id !== '',
    placeholderData: keepPreviousData
  });
