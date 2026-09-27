import type { SeriesProgress } from './series-progress.types';

import { ACHIEVEMENT_SERIES, ACHIEVEMENTS_VIEW } from '../../config';

export const seriesProgress = (maxSeries: Record<string, number>): SeriesProgress[] =>
  ACHIEVEMENT_SERIES.map(({ name, keys, threshold }) => {
    const best = Math.max(0, ...keys.map((key) => maxSeries[key] ?? 0));

    return {
      name,
      best,
      threshold,
      progress: Math.min(best / threshold, 1) * ACHIEVEMENTS_VIEW.percentScale,
      achieved: best >= threshold
    };
  });
