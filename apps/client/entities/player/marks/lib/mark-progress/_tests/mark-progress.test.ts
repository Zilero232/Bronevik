import { MOE } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { markCountAt, markProgress, markRing, markTarget } from '../mark-progress';

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

describe('markRing', () => {
  it('fills toward the next mark from the last one', () => {
    expect(markRing((ONE + TWO) / 2)).toEqual({ marks: 1, nextMark: TWO, ratio: 0.5 });
  });

  it('starts with no marks below the first threshold', () => {
    expect(markRing(0)).toEqual({ marks: 0, nextMark: ONE, ratio: 0 });
  });

  it('shows a full ring once the third mark is earned', () => {
    expect(markRing(THREE + 1)).toEqual({ marks: 3, nextMark: null, ratio: 1 });
  });
});

describe('markTarget', () => {
  it('aims one mark above the current level and stays on three once it is earned', () => {
    const levels = [markRing(0).marks, markRing(ONE).marks, markRing(TWO).marks, markRing(THREE).marks];

    expect(levels.map(markTarget)).toEqual([1, 2, 3, 3]);
  });
});
