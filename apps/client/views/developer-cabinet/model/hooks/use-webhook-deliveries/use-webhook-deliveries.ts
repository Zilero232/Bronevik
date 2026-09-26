'use client';

import { useQuery } from '@tanstack/react-query';

import { getWebhookDeliveries } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useWebhookDeliveries = (id: string) =>
  useQuery({ queryKey: QUERY_KEYS.me.developer.deliveries(id), queryFn: () => getWebhookDeliveries(id) });
