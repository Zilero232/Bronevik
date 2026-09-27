import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import type { GuessSubjectInput } from '../guess-subject.types';

import { guessSubject } from '../guess-subject';

const VEHICLE: VehicleSummary = {
  tankId: 1,
  tier: 10,
  isPremium: false,
  name: 'T1',
  shortName: 'T1',
  slug: 't-1',
  nation: 'ussr',
  type: 'heavyTank',
  isCollectible: false,
  images: { small: null, contour: null, big: null }
};

describe('guessSubject', () => {
  it('has no numbers while the detail is loading', () => {
    expect(guessSubject({ vehicle: VEHICLE, detail: undefined })).toEqual({ vehicle: VEHICLE, avgDamage: null, winRate: null });
  });

  it('reads the whole-server cohort', () => {
    const detail: GuessSubjectInput['detail'] = {
      serverStats: [
        { cohort: 'elite', avgDamage: 4000, winRate: 60 },
        { cohort: 'all', avgDamage: 2500, winRate: 50 }
      ]
    };

    expect(guessSubject({ vehicle: VEHICLE, detail })).toEqual({ vehicle: VEHICLE, avgDamage: 2500, winRate: 50 });
  });
});
