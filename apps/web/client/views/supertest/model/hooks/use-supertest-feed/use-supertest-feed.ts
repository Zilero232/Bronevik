'use client';

import { useQuery } from '@tanstack/react-query';

import { SESSION_REQUEST } from '@/shared/api/http';
import { supertestControllerListOptions, supertestControllerMineOptions } from '@/shared/api/query-options';

import type { UseSupertestFeedInput } from './use-supertest-feed.types';

import { SUPERTEST } from '../../../config';

export const useSupertestFeed = ({ scope }: UseSupertestFeedInput) => {
  const all = useQuery({ ...supertestControllerListOptions(), staleTime: SUPERTEST.staleMs, enabled: scope === 'all' });
  const mine = useQuery({ ...supertestControllerMineOptions({ ...SESSION_REQUEST }), staleTime: SUPERTEST.staleMs, enabled: scope === 'mine' });

  const query = scope === 'mine' ? mine : all;

  return { data: query.data?.announcements, isError: query.isError, isRefetching: query.isRefetching, refetch: query.refetch };
};
