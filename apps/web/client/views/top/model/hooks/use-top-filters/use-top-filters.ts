'use client';

import type { TankClass } from '@otmetki/icons';
import type { RatingKind, RatingPeriod, VehicleSummary } from '@otmetki/schemas';

import { toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import type { ActiveFilter } from '@/ui-kit';

import { TOP_METRICS, TOP_PERIODS, TOP_TANK_SCOPES } from '../../../config';
import { metricFor } from '../../../lib/top-filter';
import { useTopParams } from '../use-top-params';
import { useTopTank } from '../use-top-tank';

export const useTopFilters = () => {
  const t = useTranslations('top');
  const tPeriods = useTranslations('periods');
  const tGame = useTranslations('game.classes');
  const tFilters = useTranslations('common.filters');
  const [{ scope, metric, period, tier, type }, setParams] = useTopParams();
  const tank = useTopTank();

  const active: ActiveFilter[] = [
    ...(tier === null
      ? []
      : [{ id: 'tier', label: tFilters('span', { label: t('tier'), value: toRoman(tier) }), onRemove: () => void setParams({ tier: null }) }]),
    ...(type === null
      ? []
      : [{ id: 'type', label: tFilters('span', { label: t('type'), value: tGame(type) }), onRemove: () => void setParams({ type: null }) }]),
    ...(tank
      ? [{ id: 'tank', label: tFilters('span', { label: t('tank'), value: tank.shortName }), onRemove: () => void setParams({ tank: null }) }]
      : [])
  ];

  return {
    scope,
    metrics: TOP_METRICS[scope].map((value) => ({ value, label: t(`metrics.${value}`) })),
    periods: TOP_PERIODS.map((value) => ({ value, label: tPeriods(value) })),
    metric: metricFor({ scope, metric }),
    period,
    tiers: tier === null ? [] : [tier],
    types: type === null ? [] : [type],
    active,
    tank,
    hasTank: TOP_TANK_SCOPES.includes(scope),
    onMetricChange: (next: RatingKind) => void setParams({ metric: next }),
    onPeriodChange: (next: RatingPeriod) => void setParams({ period: next }),
    onTiersChange: (next: number[]) => void setParams({ tier: next[0] ?? null }),
    onTypesChange: (next: TankClass[]) => void setParams({ type: next.find((value) => value !== type) ?? null }),
    onTankChange: (vehicle: VehicleSummary | null) => void setParams({ tank: vehicle?.tankId ?? null }),
    onReset: () => void setParams({ tier: null, type: null, tank: null })
  };
};
