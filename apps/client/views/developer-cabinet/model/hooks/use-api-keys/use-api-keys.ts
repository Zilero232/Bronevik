'use client';

import { useQuery } from '@tanstack/react-query';

import { getApiKeys } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useApiKeys = () => useQuery({ queryKey: QUERY_KEYS.me.developer.keys, queryFn: getApiKeys });
