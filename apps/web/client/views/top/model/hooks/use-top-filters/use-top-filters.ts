'use client';

import type { RatingKind, RatingPeriod, VehicleSummary, VehicleType } from '@otmetki/schemas';

import { TIERS, toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { TOP_BOARD, TOP_METRICS, TOP_PERIODS, TOP_TANK_SCOPES } from '../../../config';
import { metricFor } from '../../../lib/top-filter';
import { useTopParams } from '../use-top-params';
import { useTopTank } from '../use-top-tank';

export const useTopFilters = () => {
  const t = useTranslations('top');
  const tPeriods = useTranslations('periods');
  const [{ scope, metric, period, tier, type }, setParams] = useTopParams();
  const tank = useTopTank();

  return {
    scope,
    metrics: TOP_METRICS[scope].map((value) => ({ value, label: t(`metrics.${value}`) })),
    periods: TOP_PERIODS.map((value) => ({ value, label: tPeriods(value) })),
    tiers: [{ value: TOP_BOARD.anyOption, label: t('allTiers') }, ...TIERS.map((value) => ({ value: String(value), label: toRoman(value) }))],
    metric: metricFor({ scope, metric }),
    period,
    tier: tier === null ? TOP_BOARD.anyOption : String(tier),
    type: type ?? TOP_BOARD.anyOption,
    tank,
    hasTank: TOP_TANK_SCOPES.includes(scope),
    onMetricChange: (next: RatingKind) => void setParams({ metric: next }),
    onPeriodChange: (next: RatingPeriod) => void setParams({ period: next }),
    onTierChange: (next: string) => void setParams({ tier: next === TOP_BOARD.anyOption ? null : Number(next) }),
    onTypeChange: (next: VehicleType | typeof TOP_BOARD.anyOption) => void setParams({ type: next === TOP_BOARD.anyOption ? null : next }),
    onTankChange: (vehicle: VehicleSummary | null) => void setParams({ tank: vehicle?.tankId ?? null })
  };
};
