'use client';

import { useQuery } from '@tanstack/react-query';

import { getOpenApiSpec } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';

import { groupEndpoints } from '../../lib/openapi-endpoints';

export const useEndpointGroups = () =>
  useQuery({
    queryKey: QUERY_KEYS.developer.spec,
    queryFn: getOpenApiSpec,
    select: groupEndpoints,
    staleTime: 60 * 60_000
  });
