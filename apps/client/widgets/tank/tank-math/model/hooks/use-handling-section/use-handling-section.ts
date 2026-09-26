'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { ChartSeries, StatListItem } from '@/ui-kit';

import type { UseHandlingSectionInput } from './use-handling-section.types';

import { SCENARIO_TONES, TANK_MATH_FORMAT } from '../../../config';
import { handlingCurves, handlingRows } from '../../../lib/handling-view';

export const useHandlingSection = ({ config, other }: UseHandlingSectionInput) => {
  const t = useTranslations('tankMath.handling');
  const format = useFormatter();

  const curves = handlingCurves(config.handling);
  const rows = handlingRows({ handling: config.handling, other: other?.handling });
  const score = rows.find((row) => row.id === 'score');

  const formatDispersion = (value: number): string => t('meters', { value: format.number(value, TANK_MATH_FORMAT.dispersion) });
  const formatSeconds = (value: number): string => t('seconds', { value: format.number(value, TANK_MATH_FORMAT.seconds) });

  const labels = curves.times.map(formatSeconds);

  const series: ChartSeries[] = curves.series.map(({ scenario, values }) => ({
    id: scenario,
    label: t(`scenarios.${scenario}`),
    values,
    tone: SCENARIO_TONES[scenario]
  }));

  const items: StatListItem[] = rows
    .filter((row) => row.id !== 'score')
    .map((row) => ({
      id: row.id,
      label: t(`rows.${row.id}`),
      value: row.id === 'dispersion' ? formatDispersion(row.value) : formatSeconds(row.value),
      delta: row.delta,
      isDeltaLowerBetter: true
    }));

  return {
    labels,
    series,
    items,
    score: score ? { value: formatDispersion(score.value), delta: score.delta ?? undefined } : null,
    formatDispersion
  };
};
