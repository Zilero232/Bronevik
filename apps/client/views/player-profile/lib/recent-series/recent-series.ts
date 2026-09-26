import { takeLast } from 'remeda';

import type { RecentSeriesInput } from './recent-series.types';

export const recentSeries = ({ series, count }: RecentSeriesInput): number[] =>
  takeLast(
    (series?.points ?? []).flatMap(({ value }) => (value === null ? [] : [value])),
    Math.max(0, count)
  );
