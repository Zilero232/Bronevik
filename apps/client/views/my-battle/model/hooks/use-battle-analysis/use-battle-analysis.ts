'use client';

import { useQuery } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import { sumBy } from 'remeda';

import { usePlus } from '@/features/plus/plus-gate';
import { getBattleAnalysis } from '@/entities/player/analytics';
import { isPlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { DAMAGE_BREAKDOWN, EFFICIENCY_KEYS, MY_BATTLE } from '../../../config';
import { efficiencyTone } from '../../../lib/battle-format';

export const useBattleAnalysis = (id: string) => {
  const t = useTranslations('analytics.battle.mistakes');
  const format = useFormatter();
  const { isPlus } = usePlus();
  const query = useQuery({
    queryKey: QUERY_KEYS.me.analytics.analysis(id),
    queryFn: ({ signal }) => getBattleAnalysis({ id, signal }),
    enabled: isPlus,
    retry: false
  });

  const data = query.data;
  const needsPlus = isPlusRequiredError(query.error);
  const total = data ? sumBy(DAMAGE_BREAKDOWN, (key) => data.breakdown[key]) : 0;
  const number = (value: number | null) => (value === null ? '—' : format.number(value, { maximumFractionDigits: 1 }));

  return {
    data,
    needsPlus,
    isError: query.isError && !needsPlus,
    isRetrying: query.isFetching,
    retry: () => void query.refetch(),
    efficiency: EFFICIENCY_KEYS.map((key) => {
      const value = data?.efficiency[key] ?? null;

      return { key, value, tone: efficiencyTone(value) };
    }),
    breakdown: DAMAGE_BREAKDOWN.map((key) => {
      const value = data?.breakdown[key] ?? 0;

      return { key, value, share: total > 0 ? (value / total) * MY_BATTLE.percentScale : 0 };
    }),
    rolls: (data?.rolls ?? []).map((roll, index) => ({ ...roll, index, deviation: (roll.ratio - 1) * MY_BATTLE.percentScale })),
    mistakes: (data?.mistakes ?? []).map((mistake) => ({
      code: mistake.code,
      text: t(mistake.code, { value: number(mistake.value), reference: number(mistake.reference) })
    }))
  };
};
