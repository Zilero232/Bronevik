'use client';

import { useQuery } from '@tanstack/react-query';

import { listMoe } from '@/shared/api/marks';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useMarksMovement = () => {
  const params = { sort: 'p95Delta30d', order: 'desc', limit: HOME.marks.limit } as const;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.marks.list(params),
    queryFn: ({ signal }) => listMoe({ ...params, signal })
  });

  const rows = (data?.items ?? []).filter((row) => row.moe !== null);

  return { rows, updatedAt: rows[0]?.updatedAt ?? null, isPending, isError, retry: () => void refetch() };
};
