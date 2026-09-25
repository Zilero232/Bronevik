import { describe, expect, it } from 'vitest';

import { assignCohort } from '../cohort';
import { COHORT } from '../cohort.constants';

const veteran = COHORT.minBattles * 10;

describe('assignCohort', () => {
  it('puts an account below the battle floor into beginner regardless of skill', () => {
    expect(assignCohort({ battles: COHORT.minBattles - 1, winRate: 70, wn8: COHORT.wn8.elite * 2 })).toBe('beginner');
  });

  it('prefers WN8 over win rate when both are known', () => {
    expect(assignCohort({ battles: veteran, winRate: COHORT.winRate.average - 1, wn8: COHORT.wn8.elite })).toBe('elite');
  });

  it('falls back to win rate without WN8', () => {
    expect(assignCohort({ battles: veteran, winRate: COHORT.winRate.good, wn8: null })).toBe('good');
    expect(assignCohort({ battles: veteran, winRate: COHORT.winRate.average })).toBe('average');
    expect(assignCohort({ battles: veteran, winRate: COHORT.winRate.average - 0.1 })).toBe('beginner');
  });

  it('is monotonic in WN8', () => {
    const order = ['beginner', 'average', 'good', 'elite'];
    const cohorts = [0, COHORT.wn8.average, COHORT.wn8.good, COHORT.wn8.elite].map((wn8) => assignCohort({ battles: veteran, winRate: 50, wn8 }));

    expect(cohorts.map((cohort) => order.indexOf(cohort))).toEqual([0, 1, 2, 3]);
  });
});
