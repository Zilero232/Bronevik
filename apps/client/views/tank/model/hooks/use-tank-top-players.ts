'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';

import { getTankTopPlayers } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { TANK_PAGE, TANK_URL_PARSERS } from '../../config';
import { useTank } from '../context';

export const useTankTopPlayers = () => {
  const { tankId } = useTank();
  const [metric, setMetric] = useQueryState('metric', TANK_URL_PARSERS.metric.withOptions({ history: 'replace', scroll: false }));
  const {
    data: top,
    isPending,
    isError,
    isPlaceholderData
  } = useQuery({
    queryKey: QUERY_KEYS.tanks.topPlayers({ tankId, metric, limit: TANK_PAGE.topLimit }),
    queryFn: ({ signal }) => getTankTopPlayers({ tankId, metric, limit: TANK_PAGE.topLimit, signal }),
    placeholderData: keepPreviousData
  });

  return { metric, setMetric, top, isPending, isError, isPlaceholderData };
};
