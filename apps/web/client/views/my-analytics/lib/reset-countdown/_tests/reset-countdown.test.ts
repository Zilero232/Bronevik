import { describe, expect, it } from 'vitest';

import { secondsUntil } from '../reset-countdown';

const NOW = Date.UTC(2026, 8, 26, 12);

describe('secondsUntil', () => {
  it('counts whole seconds to a future reset', () => {
    const later = new Date(NOW + 90_500).toISOString();

    expect(secondsUntil({ at: later, now: NOW })).toBe(90);
  });

  it('never goes negative once the reset has passed', () => {
    expect(secondsUntil({ at: new Date(NOW - 1000).toISOString(), now: NOW })).toBe(0);
  });
});
