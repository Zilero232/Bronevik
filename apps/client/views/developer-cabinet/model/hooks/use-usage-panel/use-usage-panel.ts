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

  const keyItems = keys?.map(({ id, name }) => ({ value: id, label: name })) ?? [];
  const isFailed = keysQuery.isError || usageQuery.isError;
  const isRetrying = keysQuery.isFetching || usageQuery.isFetching;

  const onRetry = () => void (keysQuery.isError ? keysQuery.refetch() : usageQuery.refetch());

  return {
    keyItems,
    selectedId,
    setKeyId,
    period,
    setPeriod,
    usage: usageQuery.data,
    isStale: usageQuery.isPlaceholderData,
    isFailed,
    isRetrying,
    onRetry
  };
};
