import { projectMoeBattles, toMoeThresholds } from '@bronevik/ratings';

import type { MarksProjection, MarksProjectionInput } from './marks-projection.types';

export const projectMarks = ({ row, averageDamage, targetPercent }: MarksProjectionInput): MarksProjection => {
  const { moePercent, thresholds } = row;
  const damage = row.avgCombinedDamage ?? averageDamage;

  if (moePercent === null || thresholds === null) {
    return { kind: 'unknown' };
  }

  if (moePercent >= targetPercent) {
    return { kind: 'done' };
  }

  if (damage === null || damage <= 0) {
    return { kind: 'unknown' };
  }

  const { battles } = projectMoeBattles({
    currentPercent: moePercent,
    targetPercent,
    averageCombinedDamage: damage,
    thresholds: toMoeThresholds(thresholds)
  });

  return battles === null ? { kind: 'unreachable' } : { kind: 'projected', battles };
};
