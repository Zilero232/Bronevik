import { describe, expect, it } from 'vitest';

import { clampPercent, clampPercentDelta, fromUnixSeconds, isoDay, percentOf, ratio, toIso, toIsoDate, toNumber } from '../serialize';

const date = new Date('2026-09-26T23:30:00Z');

describe('toIso', () => {
  it('keeps a missing date missing', () => {
    expect(toIso(null)).toBeNull();
    expect(toIso(undefined)).toBeNull();
  });

  it('serialises a date in UTC', () => {
    expect(toIso(date)).toBe('2026-09-26T23:30:00.000Z');
  });
});

describe('isoDay and toIsoDate', () => {
  it('uses the UTC calendar day', () => {
    expect(isoDay(date)).toBe('2026-09-26');
    expect(toIsoDate(date)).toBe('2026-09-26');
    expect(toIsoDate(null)).toBeNull();
  });
});

describe('toNumber', () => {
  it('converts bigints and passes numbers through', () => {
    expect(toNumber(42n)).toBe(42);
    expect(toNumber(7)).toBe(7);
  });
});

describe('ratio and percentOf', () => {
  it('has no value for a zero denominator', () => {
    expect(ratio({ value: 5, by: 0 })).toBeNull();
    expect(percentOf({ value: 5, by: 0 })).toBeNull();
  });

  it('divides by a positive denominator, keeping a zero numerator as zero', () => {
    expect(ratio({ value: 0, by: 4 })).toBe(0);
    expect(percentOf({ value: 1, by: 4 })).toBe(25);
  });

  it('caps a percentage at one hundred', () => {
    expect(percentOf({ value: 5, by: 4 })).toBe(100);
  });
});

describe('clampPercent', () => {
  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY])('has no value for %s', (value) => {
    expect(clampPercent(value)).toBeNull();
  });

  it('clamps into 0..100 and keeps the bounds and zero', () => {
    expect(clampPercent(-3)).toBe(0);
    expect(clampPercent(0)).toBe(0);
    expect(clampPercent(100)).toBe(100);
    expect(clampPercent(140)).toBe(100);
  });
});

describe('clampPercentDelta', () => {
  it('keeps the sign and clamps into -100..100', () => {
    expect(clampPercentDelta(-140)).toBe(-100);
    expect(clampPercentDelta(-5)).toBe(-5);
    expect(clampPercentDelta(140)).toBe(100);
    expect(clampPercentDelta(null)).toBeNull();
  });
});

describe('fromUnixSeconds', () => {
  it.each([null, undefined, 0, -1])('treats %s as an unknown time', (seconds) => {
    expect(fromUnixSeconds(seconds)).toBeNull();
  });

  it('converts seconds since the epoch', () => {
    expect(fromUnixSeconds(date.getTime() / 1000)).toEqual(date);
  });
});
