import { describe, expect, it } from 'vitest';

import { aggregateShares } from '..';

describe('aggregateShares', () => {
  it('turns counts into shares that sum to one', () => {
    const shares = aggregateShares({
      buckets: [
        { bucket: 'x8', count: 5 },
        { bucket: 'x16', count: 15 }
      ]
    });

    expect(shares.reduce((sum, { share }) => sum + share, 0)).toBeCloseTo(1);
    expect(shares.find(({ isTop }) => isTop)?.bucket).toBe('x16');
    expect(shares[1]?.share).toBeGreaterThan(shares[0]?.share ?? 1);
  });

  it('handles empty buckets', () => {
    expect(aggregateShares({ buckets: [] })).toEqual([]);
    expect(aggregateShares({ buckets: [{ bucket: 'a', count: 0 }] })).toEqual([{ bucket: 'a', count: 0, share: 0, isTop: false }]);
  });
});
