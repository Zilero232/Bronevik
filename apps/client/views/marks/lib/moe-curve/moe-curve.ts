import { simulateMoe } from '@bronevik/ratings';
import { clamp } from 'remeda';

import type { MoeCurvePoint, ProjectionCurveInput } from './moe-curve.types';

import { MOE_PROJECTION } from '../../config';

export const curveLength = (battlesNeeded: number | null): number =>
  clamp(Math.ceil((battlesNeeded || MOE_PROJECTION.fallbackBattles) * MOE_PROJECTION.overshoot), {
    min: MOE_PROJECTION.minBattles,
    max: MOE_PROJECTION.maxBattles
  });

export const projectionCurve = ({ currentPercent, averageDamage, thresholds, battlesNeeded }: ProjectionCurveInput): MoeCurvePoint[] => {
  const length = curveLength(battlesNeeded);
  const step = Math.max(1, Math.ceil(length / MOE_PROJECTION.maxPoints));
  const percents = simulateMoe({ startPercent: currentPercent, combinedDamages: Array.from<number>({ length }).fill(averageDamage), thresholds });

  const points = percents.flatMap((percent, index) => {
    const battle = index + 1;

    return battle % step === 0 || battle === length ? [{ battle, percent }] : [];
  });

  return [{ battle: 0, percent: currentPercent }, ...points];
};
