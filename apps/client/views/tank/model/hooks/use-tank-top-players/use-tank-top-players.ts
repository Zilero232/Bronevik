'use client';

import type { TopPlayersMetric } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useFormatter } from 'next-intl';
import { useQueryState } from 'nuqs';

import { getTankTopPlayers } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import type { TopPlayerRow } from './use-tank-top-players.types';

import { TANK_PAGE, TANK_URL_PARSERS } from '../../../config';
import { playerMetric } from '../../../lib';
import { useTank } from '../../context';

export const useTankTopPlayers = () => {
  const format = useFormatter();
  const { tankId } = useTank();
  const [metric, setMetric] = useQueryState('metric', TANK_URL_PARSERS.metric.withOptions({ history: 'replace', scroll: false }));
  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEYS.tanks.topPlayers({ tankId, metric, limit: TANK_PAGE.topLimit }),
    queryFn: ({ signal }) => getTankTopPlayers({ tankId, metric, limit: TANK_PAGE.topLimit, signal }),
    placeholderData: keepPreviousData
  });

  const rows: TopPlayerRow[] = (data?.entries ?? []).map((entry) => {
    const { value, tone, isPercent } = playerMetric({ metric, entry });

    return {
      key: `${metric}-${entry.rank}-${entry.name}`,
      rank: entry.rank,
      isPodium: entry.rank <= TANK_PAGE.podium,
      player: { nickname: entry.name, clanTag: entry.clanTag },
      battles: format.number(entry.battles),
      value: isPercent ? `${format.number(value, { maximumFractionDigits: 2 })}\u00A0%` : format.number(value, { maximumFractionDigits: 0 }),
      tone
    };
  });

  const onMetricChange = (value: TopPlayersMetric) => {
    void setMetric(value);
  };

  return { metric, onMetricChange, rows, isPending, isError, isStale: isPlaceholderData, refetch };
};
