import { describe, expect, it } from 'vitest';

import { isoToZonedInput, zonedInputToIso } from '../zoned-time';

describe('zonedInputToIso', () => {
  it('reads the picker value as Moscow wall time', () => {
    expect(zonedInputToIso({ value: '2026-10-10T18:00' })).toBe('2026-10-10T15:00:00.000Z');
  });

  it('keeps the fixed Moscow offset in winter and summer alike', () => {
    expect(zonedInputToIso({ value: '2026-01-15T00:30' })).toBe('2026-01-14T21:30:00.000Z');
    expect(zonedInputToIso({ value: '2026-07-15T00:30' })).toBe('2026-07-14T21:30:00.000Z');
  });

  it('accepts a value with seconds', () => {
    expect(zonedInputToIso({ value: '2026-10-10T18:00:30' })).toBe('2026-10-10T15:00:30.000Z');
  });

  it('honours another time zone', () => {
    expect(zonedInputToIso({ value: '2026-10-10T18:00', timeZone: 'UTC' })).toBe('2026-10-10T18:00:00.000Z');
  });

  it('returns nothing for an empty or broken value', () => {
    expect(zonedInputToIso({ value: '' })).toBeUndefined();
    expect(zonedInputToIso({ value: null })).toBeUndefined();
    expect(zonedInputToIso({ value: 'soon' })).toBeUndefined();
  });
});

describe('isoToZonedInput', () => {
  it('shows an instant as Moscow wall time', () => {
    expect(isoToZonedInput({ value: '2026-09-26T21:30:00.000Z' })).toBe('2026-09-27T00:30');
  });

  it('returns an empty value for nothing or garbage', () => {
    expect(isoToZonedInput({ value: undefined })).toBe('');
    expect(isoToZonedInput({ value: 'soon' })).toBe('');
  });

  it('round-trips with zonedInputToIso', () => {
    const value = '2026-03-29T02:30';

    expect(isoToZonedInput({ value: zonedInputToIso({ value }) })).toBe(value);
    expect(zonedInputToIso({ value: isoToZonedInput({ value: '2026-12-31T21:00:00.000Z' }) })).toBe('2026-12-31T21:00:00.000Z');
  });
});
