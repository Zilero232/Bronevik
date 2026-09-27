import { describe, expect, it } from 'vitest';

import { bulkRequestsPerSecond } from '../lesta.factory';

describe('bulkRequestsPerSecond', () => {
  it('leaves the reserved share of the budget to tier A', () => {
    const requestsPerSecond = 20;
    const reserve = 0.2;

    expect(bulkRequestsPerSecond({ requestsPerSecond, reserve })).toBeLessThanOrEqual(requestsPerSecond * (1 - reserve));
  });

  it('never drops tier B to zero', () => {
    expect(bulkRequestsPerSecond({ requestsPerSecond: 1, reserve: 0.9 })).toBe(1);
  });
});
