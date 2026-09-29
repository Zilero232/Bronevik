import type { SkillCohort, TankServerStatsRow, VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { BREAKDOWN_COHORTS } from '../../../config';
import { cohortBreakdown, cohortRow } from '../cohort-breakdown';

const VEHICLE: VehicleSummary = {
  tankId: 1,
  name: 'Объект 140',
  shortName: 'Об. 140',
  slug: 'object-140',
  nation: 'ussr',
  type: 'mediumTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null }
};

const row = (cohort: SkillCohort, winRate: number, avgDamage: number): TankServerStatsRow => ({
  vehicle: VEHICLE,
  period: '30d',
  cohort,
  mode: 'random',
  battles: 1_000,
  players: 100,
  winRate,
  playerWinRate: winRate,
  winRateDiff: 0,
  avgDamage,
  avgFrags: 1,
  avgSpotted: 1,
  avgXp: 800,
  avgBlocked: 300,
  survivalRate: 30,
  accuracy: 80,
  popularityRank: 1,
  computedAt: '2026-09-01T00:00:00.000Z'
});

const ROWS = [row('elite', 60, 3_400), row('all', 50, 2_400), row('beginner', 44, 1_500), row('good', 54, 2_800), row('average', 49, 2_100)];

describe('cohortBreakdown', () => {
  it('lists the skill cohorts in ladder order and leaves the overall row out', () => {
    expect(cohortBreakdown(ROWS).map(({ cohort }) => cohort)).toEqual([...BREAKDOWN_COHORTS]);
  });

  it('scales the strongest cohort to a full bar and keeps every other bar below it', () => {
    const bars = cohortBreakdown(ROWS);

    expect(Math.max(...bars.map(({ damageShare }) => damageShare))).toBe(1);
    expect(bars.every(({ winRateShare }) => winRateShare > 0 && winRateShare <= 1)).toBe(true);
  });

  it('reports the win rate in percent', () => {
    const elite = cohortBreakdown(ROWS).find(({ cohort }) => cohort === 'elite');

    expect(elite?.winRate).toBeCloseTo(cohortRow({ rows: ROWS, cohort: 'elite' })?.winRate ?? 0);
  });

  it('skips a cohort the server has no row for', () => {
    expect(cohortBreakdown(ROWS.filter(({ cohort }) => cohort !== 'good')).map(({ cohort }) => cohort)).not.toContain('good');
  });

  it('returns no bars for an empty response', () => {
    expect(cohortBreakdown([])).toEqual([]);
  });
});
