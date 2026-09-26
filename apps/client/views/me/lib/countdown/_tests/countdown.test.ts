import { secondsInMinute } from 'date-fns/constants';
import { describe, expect, it } from 'vitest';

import { formatCountdown } from '..';

describe('formatCountdown', () => {
  it('splits the seconds into whole minutes and the rest', () => {
    const minutes = 4;
    const seconds = 25;

    expect(formatCountdown(minutes * secondsInMinute + seconds)).toBe(`${minutes}:${seconds}`);
  });

  it('pads the seconds so the clock keeps its width', () => {
    expect(formatCountdown(secondsInMinute + 5)).toBe('1:05');
  });

  it('reads zero as an empty clock', () => {
    expect(formatCountdown(0)).toBe('0:00');
  });
});
