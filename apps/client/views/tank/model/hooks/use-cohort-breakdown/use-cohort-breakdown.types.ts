import type { RatingTone } from '@/shared/lib';

import type { CohortBar } from '../../../lib';

export type CohortLine = {
  cohort: CohortBar['cohort'];
  label: string;
  winRate: string;
  tone: RatingTone;
  avgDamage: string;
  battles: string;
  damageShare: number;
};
