import type { LeaderboardScope, RatingKind } from '@otmetki/schemas';
import type { inferParserType } from 'nuqs';

import type { TOP_PARAMS } from '../../config';

export type TopFilterState = inferParserType<typeof TOP_PARAMS>;

export type MetricForInput = {
  scope: LeaderboardScope;
  metric: RatingKind;
};
