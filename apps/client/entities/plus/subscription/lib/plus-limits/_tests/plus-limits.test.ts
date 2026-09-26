import { PLUS_LIMITS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { plusLimitsFor } from '../plus-limits';

describe('plusLimitsFor', () => {
  it('reads the same numbers the server enforces', () => {
    expect(plusLimitsFor(false).goals).toBe(PLUS_LIMITS.goals.free);
    expect(plusLimitsFor(true).overlays).toBe(PLUS_LIMITS.overlays.plus);
  });

  it('covers every countable limit', () => {
    expect(Object.keys(plusLimitsFor(false)).sort()).toEqual(['goals', 'linkedAccounts', 'overlays', 'storedReplays', 'watchedTanks']);
  });
});
