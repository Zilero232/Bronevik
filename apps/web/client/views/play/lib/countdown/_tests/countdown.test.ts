import { describe, expect, it } from 'vitest';

import { countdownClock } from '../countdown';

describe('countdownClock', () => {
  it('pads every part to two digits', () => {
    expect(countdownClock({ hours: 3, minutes: 7, seconds: 9 })).toBe('03:07:09');
  });

  it('never shows negative parts', () => {
    expect(countdownClock({ hours: 0, minutes: 0, seconds: -1 })).toBe('00:00:00');
  });
});
