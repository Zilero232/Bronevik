import { periodStats } from '@/entities/player/stats';

import type { PeriodRatingRow, PeriodRatingsInput } from './period-ratings.types';

export const periodRatings = ({ profile, periods }: PeriodRatingsInput): PeriodRatingRow[] =>
  periods.flatMap((period) => {
    const stats = periodStats({ overall: profile.summary.overall, recent: profile.recent, period });

    return stats && stats.battles > 0 ? [{ period, stats }] : [];
  });
