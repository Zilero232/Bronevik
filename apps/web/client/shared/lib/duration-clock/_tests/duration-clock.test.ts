import { describe, expect, it } from 'vitest';

import { durationParts, hoursClock, minutesClock } from '..';

describe('durationParts', () => {
  it('splits seconds into days, hours, minutes and seconds', () => {
    expect(durationParts(2 * 86_400 + 3_723)).toEqual({ days: 2, hours: 1, minutes: 2, seconds: 3 });
  });

  it('rounds fractions and clamps a negative span to zero', () => {
    expect(durationParts(59.6)).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 0 });
    expect(durationParts(-5)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('minutesClock', () => {
  it('prints whole minutes and padded seconds', () => {
    expect(minutesClock(0)).toBe('0:00');
    expect(minutesClock(65)).toBe('1:05');
    expect(minutesClock(425.4)).toBe('7:05');
  });

  it('keeps counting minutes past an hour', () => {
    expect(minutesClock(3_725)).toBe('62:05');
  });

  it('never goes negative', () => {
    expect(minutesClock(-30)).toBe('0:00');
  });
});

describe('hoursClock', () => {
  it('pads hours, minutes and seconds', () => {
    expect(hoursClock(3_723)).toBe('01:02:03');
    expect(hoursClock(59)).toBe('00:00:59');
  });

  it('keeps counting hours past a day', () => {
    expect(hoursClock(26 * 3_600)).toBe('26:00:00');
  });

  it('never goes negative', () => {
    expect(hoursClock(-1)).toBe('00:00:00');
  });
});
