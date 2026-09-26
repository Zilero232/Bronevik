import { MOE } from '@bronevik/ratings';
import { describe, expect, it } from 'vitest';

import { markCountAt, markProgress } from '../mark-progress';

const [ONE, TWO, THREE] = MOE.markPercents;

describe('markProgress', () => {
  it('measures progress from the previous mark, not from zero', () => {
    expect(markProgress({ percent: ONE, nextMark: TWO })).toBe(0);
    expect(markProgress({ percent: (TWO + THREE) / 2, nextMark: THREE })).toBeCloseTo(0.5);
  });

  it('counts the first mark from zero percent', () => {
    expect(markProgress({ percent: ONE / 2, nextMark: ONE })).toBeCloseTo(0.5);
  });

  it('never leaves the zero to one range', () => {
    expect(markProgress({ percent: THREE + 1, nextMark: THREE })).toBe(1);
  });
});

describe('markCountAt', () => {
  it('names the mark a threshold percent awards', () => {
    expect(MOE.markPercents.map(markCountAt)).toEqual([1, 2, 3]);
  });

  it('never names fewer than one mark', () => {
    expect(markCountAt(0)).toBe(1);
  });
});
