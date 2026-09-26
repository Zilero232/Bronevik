import { describe, expect, it } from 'vitest';

import { isPlusDigest } from '../watchlist';
import { WATCHLIST, WATCHLIST_DIGESTS } from '../watchlist.constants';
import { watchlistQuerySchema } from '../watchlist.schemas';

describe('isPlusDigest', () => {
  it('marks exactly the Plus-only digest intervals', () => {
    const plus = WATCHLIST_DIGESTS.filter(isPlusDigest);

    expect(plus).toEqual([...WATCHLIST.plusDigests]);
  });

  it('keeps the default digest free', () => {
    expect(isPlusDigest(WATCHLIST.defaultDigest)).toBe(false);
  });

  it('gives every sending interval a period in hours', () => {
    for (const digest of WATCHLIST_DIGESTS.filter((value) => value !== 'off')) {
      expect(WATCHLIST.digestHours[digest]).toBeGreaterThan(0);
    }
  });
});

describe('watchlistQuerySchema', () => {
  it('defaults the period', () => {
    expect(watchlistQuerySchema.parse({}).period).toBe(WATCHLIST.defaultPeriod);
  });
});
