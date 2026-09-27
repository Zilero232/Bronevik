'use client';

import { useQuery } from '@tanstack/react-query';

import { getWebhooks } from '@/entities/developer/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useWebhooks = () => useQuery({ queryKey: QUERY_KEYS.me.developer.webhooks, queryFn: getWebhooks });
