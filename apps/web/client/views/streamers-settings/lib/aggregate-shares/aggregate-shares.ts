import type { AggregateField } from '@otmetki/schemas';

import { sumBy } from 'remeda';

import type { AggregateShare } from './aggregate-shares.types';

export const aggregateShares = ({ buckets }: Pick<AggregateField, 'buckets'>): AggregateShare[] => {
  const total = sumBy(buckets, ({ count }) => count);
  const top = Math.max(0, ...buckets.map(({ count }) => count));

  return buckets.map(({ bucket, count }) => ({ bucket, count, share: total === 0 ? 0 : count / total, isTop: count > 0 && count === top }));
};
