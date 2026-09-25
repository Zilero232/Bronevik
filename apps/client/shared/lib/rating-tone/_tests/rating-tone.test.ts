import type { RatingScale } from '@bronevik/ratings';

import { RATING_SCALES, RATING_TIERS, ratingTier } from '@bronevik/ratings';
import { describe, expect, it } from 'vitest';

import { ratingTone, toneOfTier, toneThresholds } from '../rating-tone';
import { RATING_TONES } from '../rating-tone.constants';

const SCALES = Object.keys(RATING_SCALES).filter((scale): scale is RatingScale => scale in RATING_SCALES);

const toneLevel = (tier: (typeof RATING_TIERS)[number]) => RATING_TONES.indexOf(toneOfTier(tier));

describe('toneOfTier', () => {
  it('gives every canonical tier a colour group', () => {
    RATING_TIERS.forEach((tier) => expect(RATING_TONES).toContain(toneOfTier(tier)));
  });

  it('uses every colour group at least once', () => {
    expect(new Set(RATING_TIERS.map(toneOfTier))).toEqual(new Set(RATING_TONES));
  });

  it('never ranks a better tier into a lower colour group', () => {
    RATING_TIERS.slice(1).forEach((tier, index) => expect(toneLevel(tier)).toBeGreaterThanOrEqual(toneLevel(RATING_TIERS[index])));
  });
});

describe('ratingTone', () => {
  it('agrees with the canonical tier for every threshold', () => {
    SCALES.forEach((scale) => {
      RATING_SCALES[scale].forEach((value: number) => {
        expect(ratingTone({ scale, value })).toBe(toneOfTier(ratingTier({ scale, value })));
      });
    });
  });
});

describe('toneThresholds', () => {
  it('starts every colour group at the value that first reaches it', () => {
    SCALES.forEach((scale) => {
      const thresholds = toneThresholds(scale);

      RATING_TONES.forEach((tone) => {
        const start = thresholds[tone];

        expect(start).toBeDefined();
        expect(ratingTone({ scale, value: start ?? 0 })).toBe(tone);
      });
    });
  });
});
