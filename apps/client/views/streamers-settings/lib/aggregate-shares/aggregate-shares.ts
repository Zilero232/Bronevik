import type { AggregateField } from '@otmetki/schemas';

import type { AggregateShare } from './aggregate-shares.types';

export const aggregateShares = ({ buckets }: Pick<AggregateField, 'buckets'>): AggregateShare[] => {
  const total = buckets.reduce((sum, { count }) => sum + count, 0);
  const top = Math.max(0, ...buckets.map(({ count }) => count));

  return buckets.map(({ bucket, count }) => ({ bucket, count, share: total === 0 ? 0 : count / total, isTop: count > 0 && count === top }));
};
