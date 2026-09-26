import { describe, expect, it } from 'vitest';

import type { PlatoonFilters } from '../platoon-query.types';

import { hasActiveFilters, isPlatoonMode, localToIso, nextSingleTier, toPlatoonQuery, toWn8Bound } from '../platoon-query';

const NONE: PlatoonFilters = { tier: null, mode: null, voice: 'any', minWn8: null, maxWn8: null, at: null };

describe('toPlatoonQuery', () => {
  it('sends nothing when no filter is set', () => {
    expect(toPlatoonQuery(NONE)).toEqual({});
  });

  it('keeps a zero wn8 bound instead of dropping it', () => {
    expect(toPlatoonQuery({ ...NONE, minWn8: 0 })).toEqual({ minWn8: 0 });
  });

  it('sends the voice filter as the string flag the server expects', () => {
    expect(toPlatoonQuery({ ...NONE, voice: 'yes' }).hasVoice).toBe('true');
    expect(toPlatoonQuery({ ...NONE, voice: 'no' }).hasVoice).toBe('false');
  });

  it('converts the local availability time to an ISO instant', () => {
    expect(toPlatoonQuery({ ...NONE, at: '2026-09-26T20:30' }).availableAt).toBe(new Date('2026-09-26T20:30').toISOString());
  });

  it('ignores an unparsable availability time', () => {
    expect(toPlatoonQuery({ ...NONE, at: 'tonight' })).toEqual({});
  });

  it('passes tier and mode through', () => {
    expect(toPlatoonQuery({ ...NONE, tier: 10, mode: 'random' })).toEqual({ tier: 10, mode: 'random' });
  });
});

describe('localToIso', () => {
  it('treats an empty value as unset', () => {
    expect(localToIso('')).toBeUndefined();
    expect(localToIso(null)).toBeUndefined();
  });
});

describe('hasActiveFilters', () => {
  it('is false for the defaults', () => {
    expect(hasActiveFilters(NONE)).toBe(false);
  });

  it('counts a zero bound as an active filter', () => {
    expect(hasActiveFilters({ ...NONE, maxWn8: 0 })).toBe(true);
  });
});

describe('toWn8Bound', () => {
  it('parses a whole number including zero', () => {
    expect(toWn8Bound('0')).toBe(0);
    expect(toWn8Bound(' 1500 ')).toBe(1500);
  });

  it('clears the bound for empty or invalid input', () => {
    expect(toWn8Bound('')).toBeNull();
    expect(toWn8Bound('-5')).toBeNull();
    expect(toWn8Bound('12.5')).toBeNull();
  });
});

describe('nextSingleTier', () => {
  it('picks the newly clicked tier even when it sorts before the current one', () => {
    expect(nextSingleTier({ next: ['8', '10'], current: 10 })).toBe(8);
  });

  it('selects a tier when none was set', () => {
    expect(nextSingleTier({ next: ['6'], current: null })).toBe(6);
  });

  it('clears the tier when the current chip is toggled off', () => {
    expect(nextSingleTier({ next: [], current: 6 })).toBeNull();
  });
});

describe('isPlatoonMode', () => {
  it('recognises known modes and rejects free text from other clients', () => {
    expect(isPlatoonMode('random')).toBe(true);
    expect(isPlatoonMode('turbo')).toBe(false);
  });
});
