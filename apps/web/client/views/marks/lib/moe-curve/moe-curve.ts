import { firstBy, sortBy } from 'remeda';

import type { CurveEntriesInput, CurveEntry } from './moe-curve.types';

import { CURVE_THRESHOLDS } from '../../config';

export const curveEntries = ({ thresholds, points }: CurveEntriesInput): CurveEntry[] => {
  const official = CURVE_THRESHOLDS.flatMap(({ key, percent }): CurveEntry[] => {
    const damage = thresholds?.[key] ?? null;

    return damage === null ? [] : [{ percent, damage, source: 'threshold', players: null, battles: null }];
  });

  const reported = points
    .filter((point) => !official.some((entry) => entry.percent === point.percent))
    .map((point): CurveEntry => ({ percent: point.percent, damage: point.damage, source: 'mod', players: point.players, battles: point.battles }));

  return sortBy([...official, ...reported], (entry) => entry.percent);
};

export const defaultCurvePercent = (entries: readonly CurveEntry[]): number | null =>
  entries.find((entry) => entry.percent === CURVE_THRESHOLDS[2].percent)?.percent ??
  firstBy(entries, [(entry) => entry.percent, 'desc'])?.percent ??
  null;
