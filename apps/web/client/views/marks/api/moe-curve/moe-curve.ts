import { queryOptions } from '@tanstack/react-query';

import { marksControllerCurve } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { MOE_LIST } from '../../config';

export const moeCurveQuery = (tankId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.marks.curve(tankId),
    queryFn: ({ signal }) => fromSdk(() => marksControllerCurve({ path: { tankId }, signal })),
    staleTime: MOE_LIST.historyStaleMs
  });
