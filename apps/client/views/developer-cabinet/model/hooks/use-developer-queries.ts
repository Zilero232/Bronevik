'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { ApiKeyUsageInput } from '@/shared/api/developer';

import { getApiKeyErrors, getApiKeys, getApiKeyUsage, getDeveloperOverview, getWebhookDeliveries, getWebhooks } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useDeveloperOverview = () => useQuery({ queryKey: QUERY_KEYS.me.developer.overview, queryFn: getDeveloperOverview });

export const useApiKeys = () => useQuery({ queryKey: QUERY_KEYS.me.developer.keys, queryFn: getApiKeys });

export const useApiKeyUsage = ({ id, days }: ApiKeyUsageInput) =>
  useQuery({
    queryKey: QUERY_KEYS.me.developer.usage({ id, days }),
    queryFn: () => getApiKeyUsage({ id, days }),
    enabled: id !== '',
    placeholderData: keepPreviousData
  });

export const useApiKeyErrors = (id: string) =>
  useQuery({ queryKey: QUERY_KEYS.me.developer.errors(id), queryFn: () => getApiKeyErrors(id), enabled: id !== '' });

export const useWebhooks = () => useQuery({ queryKey: QUERY_KEYS.me.developer.webhooks, queryFn: getWebhooks });

export const useWebhookDeliveries = (id: string) =>
  useQuery({ queryKey: QUERY_KEYS.me.developer.deliveries(id), queryFn: () => getWebhookDeliveries(id) });
