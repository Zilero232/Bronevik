import { MOE, projectMoeBattles, toMoeThresholds } from '@otmetki/ratings';

import type { ProjectMarksInput } from './projection.types';

export const projectMarks = ({ thresholds, currentPercent, targetMarks, avgDamage }: ProjectMarksInput): number | null => {
  const targetPercent = MOE.markPercents[targetMarks - 1];

  if (targetPercent === undefined) {
    return null;
  }

  try {
    const { battles } = projectMoeBattles({
      currentPercent: currentPercent ?? 0,
      targetPercent,
      averageCombinedDamage: avgDamage,
      thresholds: toMoeThresholds({ ...thresholds, p100: thresholds.p100 !== null && thresholds.p100 > thresholds.p95 ? thresholds.p100 : null })
    });

    return battles;
  } catch {
    return null;
  }
};
