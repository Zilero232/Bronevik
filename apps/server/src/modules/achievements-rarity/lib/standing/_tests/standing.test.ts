import { describe, expect, it } from 'vitest';

import { standing } from '../standing';

describe('standing', () => {
  it('has no rank without a sample', () => {
    expect(standing({ above: 0, total: 0 })).toEqual({ rank: null, topPercent: null });
  });

  it('ranks the leader first with the smallest top share', () => {
    const leader = standing({ above: 0, total: 200 });
    const middle = standing({ above: 99, total: 200 });

    expect(leader.rank).toBe(1);
    expect(leader.topPercent ?? 100).toBeLessThan(middle.topPercent ?? 0);
  });

  it('never ranks past the sample', () => {
    expect(standing({ above: 50, total: 10 }).rank).toBe(10);
  });
});
