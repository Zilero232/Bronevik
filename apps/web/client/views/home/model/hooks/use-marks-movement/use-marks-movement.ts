'use client';

import { useQuery } from '@tanstack/react-query';

import { listMoe } from '@/entities/player/marks';
import { QUERY_KEYS } from '@/shared/constants';

import { HOME } from '../../../config';

export const useMarksMovement = () => {
  const params = { sort: 'p95Delta30d', order: 'desc', limit: HOME.marks.limit } as const;

  const query = useQuery({
    queryKey: QUERY_KEYS.marks.list(params),
    queryFn: ({ signal }) => listMoe({ ...params, signal }),
    select: ({ items }) => {
      const rows = items.filter((row) => row.moe !== null);

      return { rows, leaders: rows.slice(0, HOME.marks.highlights) };
    }
  });

  return { query, updatedAt: query.data?.rows[0]?.updatedAt ?? null };
};
