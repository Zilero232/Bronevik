'use client';

import type { AnalyticsGranularity, VehicleSummary } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { getAnalyticsTank } from '@/entities/player/analytics';
import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';
import { percentText, ratingTone } from '@/shared/lib';

import { ANALYTICS_TANK } from '../../../config';
import { useAnalyticsFilters } from '../../context';
import { useAnalyticsQuery } from '../use-analytics-query';

export const useAnalyticsTank = (tankId: number) => {
  const t = useTranslations('analytics.tank');
  const format = useFormatter();
  const router = useRouter();
  const { account } = useAnalyticsFilters();
  const { data: catalog } = useVehicleCatalog();
  const [granularity, setGranularity] = useState<AnalyticsGranularity>(ANALYTICS_TANK.defaultGranularity);
  const { data, status, isRetrying, retry } = useAnalyticsQuery({
    queryKey: QUERY_KEYS.me.analytics.tank({ account, tankId, granularity }),
    queryFn: ({ signal }) => getAnalyticsTank({ account, tankId, granularity, signal }),
    requiresPlus: true
  });

  const points = data?.points ?? [];
  const moe = data?.moe ?? [];
  const totals = data?.totals;
  const dateLabel = (at: string) => format.dateTime(new Date(at), ANALYTICS_TANK.dateFormat);

  return {
    data,
    status,
    isRetrying,
    retry,
    vehicle: data?.vehicle ?? vehicleIndex(catalog)[tankId] ?? null,
    isEmpty: (totals?.battles ?? 0) === 0,
    granularity,
    granularityOptions: ANALYTICS_TANK.granularities.map((value) => ({ value, label: t(`granularity.${value}`) })),
    setGranularity,
    tones: {
      winRate: totals?.winRate === null || totals?.winRate === undefined ? 'steel' : ratingTone({ scale: 'winRate', value: totals.winRate }),
      wn8: totals?.wn8 === null || totals?.wn8 === undefined ? 'steel' : ratingTone({ scale: 'wn8', value: totals.wn8 })
    } as const,
    labels: points.map(({ at }) => dateLabel(at)),
    winRateSeries: [{ id: 'winRate', label: t('winRate'), values: points.map(({ winRate }) => winRate ?? 0), tone: 'accent' as const }],
    damageSeries: [{ id: 'avgDamage', label: t('avgDamage'), values: points.map(({ avgDamage }) => avgDamage ?? 0), tone: 'steel' as const }],
    wn8Series: [{ id: 'wn8', label: t('wn8'), values: points.map(({ wn8 }) => wn8 ?? 0), tone: 'good' as const }],
    moeLabels: moe.map(({ at }) => dateLabel(at)),
    moeSeries: [{ id: 'moe', label: t('moe'), values: moe.map(({ percent }) => percent), tone: 'accent' as const }],
    formatPercent: (value: number) => percentText({ format, value, digits: 1 }),
    formatNumber: (value: number) => format.number(value, 'integer'),
    onTankChange: (vehicle: VehicleSummary | null) => {
      if (vehicle && vehicle.tankId !== tankId) {
        router.push(ROUTES.account.analyticsTank(vehicle.tankId));
      }
    }
  };
};
