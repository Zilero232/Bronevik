import type { MoeThreshold } from '@otmetki/schemas';

import { daysBetween } from '@/shared/lib';

import type { MoeDeltaInput, MoeSeries } from './moe-deltas.types';

import { MOE_KEYS } from '../../config';

export const moeDelta = ({ history, key, days }: MoeDeltaInput): number | null => {
  const latest = history.at(-1);

  if (!latest) {
    return null;
  }

  const baseline = [...history].reverse().find((point) => daysBetween({ from: point.date, to: latest.date }) >= days);
  const current = latest[key];
  const previous = baseline?.[key];

  if (current === null || previous === null || previous === undefined) {
    return null;
  }

  return current - previous;
};

export const moeSeries = (history: readonly MoeThreshold[]): MoeSeries => ({
  labels: history.map(({ date }) => date),
  series: MOE_KEYS.filter((key) => history.length > 0 && history.every((point) => point[key] !== null)).map((key) => ({
    key,
    values: history.map((point) => point[key] ?? 0)
  }))
});
