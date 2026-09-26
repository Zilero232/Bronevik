import { describe, expect, it } from 'vitest';

import { isLowerBetter } from '@/entities/tank/tank';

import { paramShares } from '../param-share';

describe('paramShares', () => {
  it('gives the better value a full bar and the other a shorter one', () => {
    const [stock, top] = paramShares({ key: 'shellPenetration', values: [200, 250] });

    expect(top).toBe(1);
    expect(stock).toBeLessThan(1);
  });

  it('treats the smaller value as better for a lower-is-better parameter', () => {
    expect(isLowerBetter('reloadTime')).toBe(true);

    const [stock, top] = paramShares({ key: 'reloadTime', values: [12, 10] });

    expect(top).toBe(1);
    expect(stock).toBeLessThan(1);
  });

  it('draws no bars when there is nothing to compare against', () => {
    expect(paramShares({ key: 'maxHealth', values: [2000, null] })).toEqual([null, null]);
  });
});
