'use client';

import { MOE_HISTORY } from '@bronevik/schemas';
import { useQueries } from '@tanstack/react-query';
import { chunk } from 'remeda';

import { getMoeHistoryBatch } from '@/shared/api/marks';
import { QUERY_KEYS } from '@/shared/constants';

import { MOE_LIST } from '../../config';
import { sparkPoints } from '../../lib/moe-history';

export const useMoeSparks = (tankIds: readonly number[]) =>
  useQueries({
    queries: chunk([...tankIds], MOE_HISTORY.maxBatch).map((ids) => ({
      queryKey: QUERY_KEYS.marks.historyBatch({ ids, days: MOE_LIST.sparkDays }),
      queryFn: ({ signal }: { signal: AbortSignal }) => getMoeHistoryBatch({ tankIds: ids, days: MOE_LIST.sparkDays, signal }),
      staleTime: MOE_LIST.historyStaleMs
    })),
    combine: (results) => ({
      sparks: new Map(
        results.flatMap(({ data }) =>
          (data?.series ?? []).map(({ tankId, points }): [number, number[]] => [
            tankId,
            sparkPoints({ history: points, count: MOE_LIST.sparkPoints })
          ])
        )
      ),
      isPending: results.some(({ isPending }) => isPending)
    })
  });
