import { describe, expect, it } from 'vitest';

import { LESTA_BUCKET } from '../lesta.constants';
import { bucketKeys, bulkRequestsPerSecond } from '../lesta.factory';

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

describe('bucketKeys', () => {
  it('keeps the shared single-IP buckets when no egress is configured', () => {
    expect(bucketKeys(undefined)).toEqual({ global: LESTA_BUCKET.global, bulk: LESTA_BUCKET.bulk });
  });

  it('gives every registered egress IP its own pair of buckets', () => {
    const first = bucketKeys('10.0.0.1');
    const second = bucketKeys('10.0.0.2');

    expect(first.global).not.toBe(second.global);
    expect(first.bulk).not.toBe(second.bulk);
    expect(first.global).not.toBe(first.bulk);
  });
});
