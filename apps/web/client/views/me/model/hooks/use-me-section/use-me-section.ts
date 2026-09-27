'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseMeSectionInput } from './use-me-section.types';

export const useMeSection = <T>({ section, fetcher }: UseMeSectionInput<T>) =>
  useQuery({ queryKey: QUERY_KEYS.me.section(section), queryFn: fetcher });
