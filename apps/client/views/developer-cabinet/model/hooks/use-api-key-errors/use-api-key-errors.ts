'use client';

import { useQuery } from '@tanstack/react-query';

import { getApiKeyErrors } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

export const useApiKeyErrors = (id: string) =>
  useQuery({ queryKey: QUERY_KEYS.me.developer.errors(id), queryFn: () => getApiKeyErrors(id), enabled: id !== '' });
