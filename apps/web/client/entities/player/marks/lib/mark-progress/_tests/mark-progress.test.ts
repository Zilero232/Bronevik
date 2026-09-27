import { MOE } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { markRing, markTarget } from '../mark-progress';

const [ONE, TWO, THREE] = MOE.markPercents;

describe('markRing', () => {
  it('names the earned marks and the next threshold', () => {
    expect(markRing((ONE + TWO) / 2)).toEqual({ marks: 1, nextMark: TWO });
  });

  it('starts with no marks below the first threshold', () => {
    expect(markRing(0)).toEqual({ marks: 0, nextMark: ONE });
  });

  it('has no next threshold once the third mark is earned', () => {
    expect(markRing(THREE + 1)).toEqual({ marks: 3, nextMark: null });
  });
});

describe('markTarget', () => {
  it('aims one mark above the current level and stays on three once it is earned', () => {
    const levels = [markRing(0).marks, markRing(ONE).marks, markRing(TWO).marks, markRing(THREE).marks];

    expect(levels.map(markTarget)).toEqual([1, 2, 3, 3]);
  });
});
