import { describe, expect, it } from 'vitest';

import { fromUnixSeconds, isoDay, toIso, toIsoDate, toNumber } from '../serialize';

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

describe('fromUnixSeconds', () => {
  it.each([null, undefined, 0, -1])('treats %s as an unknown time', (seconds) => {
    expect(fromUnixSeconds(seconds)).toBeNull();
  });

  it('converts seconds since the epoch', () => {
    expect(fromUnixSeconds(date.getTime() / 1000)).toEqual(date);
  });
});
