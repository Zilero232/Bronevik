import { toRoman } from '@otmetki/icons';
import { describe, expect, it } from 'vitest';

import { nextTierSelection, tierRuns, tierSpans, tierSpanText } from '../tier-selection';

const OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const base = { options: OPTIONS, anchor: null, isRange: false, mode: 'multiple', isRequired: false } as const;

describe('nextTierSelection', () => {
  it('adds a tier in option order', () => {
    expect(nextTierSelection({ ...base, value: [8], tier: 6 })).toEqual([6, 8]);
  });

  it('removes a picked tier', () => {
    expect(nextTierSelection({ ...base, value: [6, 8], tier: 8 })).toEqual([6]);
  });

  it('keeps the last tier when a pick is required', () => {
    expect(nextTierSelection({ ...base, value: [8], tier: 8, isRequired: true })).toEqual([8]);
  });

  it('fills the span from the anchor on a range pick, either direction', () => {
    expect(nextTierSelection({ ...base, value: [6], tier: 8, anchor: 6, isRange: true })).toEqual([6, 7, 8]);
    expect(nextTierSelection({ ...base, value: [8], tier: 6, anchor: 8, isRange: true })).toEqual([6, 7, 8]);
  });

  it('keeps the tiers already picked outside the span', () => {
    expect(nextTierSelection({ ...base, value: [1, 6], tier: 8, anchor: 6, isRange: true })).toEqual([1, 6, 7, 8]);
  });

  it('treats a range pick without an anchor as a toggle', () => {
    expect(nextTierSelection({ ...base, value: [], tier: 8, isRange: true })).toEqual([8]);
  });

  it('replaces the tier in single mode and clears it on a second pick', () => {
    expect(nextTierSelection({ ...base, mode: 'single', value: [6], tier: 8 })).toEqual([8]);
    expect(nextTierSelection({ ...base, mode: 'single', value: [8], tier: 8 })).toEqual([]);
    expect(nextTierSelection({ ...base, mode: 'single', value: [8], tier: 8, isRequired: true })).toEqual([8]);
  });
});

describe('tierRuns', () => {
  it('marks the ends and the middle of adjacent picks', () => {
    const runs = tierRuns({ options: OPTIONS, value: [6, 7, 8, 10] });

    expect([...runs]).toEqual([
      [6, 'start'],
      [7, 'middle'],
      [8, 'end'],
      [10, 'single']
    ]);
  });

  it('is empty with nothing picked', () => {
    expect(tierRuns({ options: OPTIONS, value: [] }).size).toBe(0);
  });
});

describe('tierSpans', () => {
  it('folds adjacent tiers into spans', () => {
    expect(tierSpans({ options: OPTIONS, value: [10, 6, 7, 8, 1] })).toEqual([
      { from: 1, to: 1 },
      { from: 6, to: 8 },
      { from: 10, to: 10 }
    ]);
  });
});

describe('tierSpanText', () => {
  it('writes spans as roman ranges', () => {
    expect(tierSpanText({ options: OPTIONS, value: [6, 7, 8, 10] })).toBe(`${toRoman(6)}–${toRoman(8)}, ${toRoman(10)}`);
  });
});
