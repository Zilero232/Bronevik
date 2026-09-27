'use client';

import { useState } from 'react';

import type { UsagePeriod } from './use-usage-panel.types';

import { USAGE } from '../../../config';
import { useApiKeyUsage } from '../use-api-key-usage';
import { useApiKeys } from '../use-api-keys';

export const useUsagePanel = () => {
  const keysQuery = useApiKeys();
  const [keyId, setKeyId] = useState('');
  const [period, setPeriod] = useState<UsagePeriod>(USAGE.initialPeriod);

  const keys = keysQuery.data;
  const selectedId = keys?.some(({ id }) => id === keyId) ? keyId : (keys?.[0]?.id ?? '');
  const usageQuery = useApiKeyUsage({ id: selectedId, days: Number(period) });

  return {
    keyItems: keys?.map(({ id, name }) => ({ value: id, label: name })) ?? [],
    hasNoKeys: keys?.length === 0,
    selectedId,
    setKeyId,
    period,
    setPeriod,
    isStale: usageQuery.isPlaceholderData,
    query: {
      data: usageQuery.data,
      isError: keysQuery.isError || usageQuery.isError,
      isRefetching: keysQuery.isFetching || usageQuery.isFetching,
      refetch: () => (keysQuery.isError ? keysQuery.refetch() : usageQuery.refetch())
    }
  };
};
