import { describe, expect, it } from 'vitest';

import { composeZonedInput, isoToZonedInput, roundedZonedInput, zonedInputParts, zonedInputToIso } from '../zoned-time';

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

describe('zonedInputParts', () => {
  it('splits the value into the zoned day and the wall-clock time', () => {
    const parts = zonedInputParts({ value: '2026-10-10T18:05' });

    expect(parts?.hours).toBe(18);
    expect(parts?.minutes).toBe(5);
    expect(composeZonedInput({ day: parts?.day ?? new Date(0), hours: 0, minutes: 0 })).toBe('2026-10-10T00:00');
  });

  it('returns null for an empty or broken value', () => {
    expect(zonedInputParts({ value: '' })).toBeNull();
    expect(zonedInputParts({ value: 'soon' })).toBeNull();
  });
});

describe('composeZonedInput', () => {
  it('round-trips through zonedInputParts', () => {
    const value = '2026-12-31T23:45';
    const parts = zonedInputParts({ value });

    expect(parts && composeZonedInput(parts)).toBe(value);
  });
});

describe('roundedZonedInput', () => {
  it('rounds the zoned now up to the next step', () => {
    expect(roundedZonedInput({ now: new Date('2026-10-10T15:07:00.000Z'), stepMinutes: 15 })).toBe('2026-10-10T18:15');
  });

  it('keeps a time that already sits on the step', () => {
    expect(roundedZonedInput({ now: new Date('2026-10-10T15:30:00.000Z'), stepMinutes: 15 })).toBe('2026-10-10T18:30');
  });

  it('rolls over midnight in the zone', () => {
    expect(roundedZonedInput({ now: new Date('2026-10-10T20:55:00.000Z'), stepMinutes: 15 })).toBe('2026-10-11T00:00');
  });
});
