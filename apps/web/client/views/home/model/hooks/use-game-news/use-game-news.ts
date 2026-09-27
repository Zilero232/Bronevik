'use client';

import { useQuery } from '@tanstack/react-query';

import { shopControllerListNewsOptions } from '@/shared/api/query-options';

import { HOME } from '../../../config';

export const useGameNews = () =>
  useQuery({
    ...shopControllerListNewsOptions({ query: { limit: HOME.news.limit } }),
    staleTime: HOME.staleMs,
    select: ({ items }) => items
  });
