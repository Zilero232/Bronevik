import { describe, expect, it } from 'vitest';

import { usageLimit } from '../usage';
import { USAGE_METER_KEYS, USAGE_METERS } from '../usage.constants';

describe('usageLimit', () => {
  it('never gives a signed-in user less than an anonymous visitor', () => {
    for (const meter of USAGE_METER_KEYS) {
      expect(usageLimit({ meter, audience: 'free' })).toBeGreaterThanOrEqual(usageLimit({ meter, audience: 'anonymous' }) ?? 0);
    }
  });

  it('leaves every meter unlimited for Plus', () => {
    for (const meter of USAGE_METER_KEYS) {
      expect(usageLimit({ meter, audience: 'plus' })).toBeNull();
    }
  });

  it('lists every configured meter as a key', () => {
    expect([...USAGE_METER_KEYS].sort()).toEqual(Object.keys(USAGE_METERS).sort());
  });
});
