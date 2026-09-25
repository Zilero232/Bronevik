import { API_PLAN_LIMITS, apiPlanSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { planGauge } from '../plan-gauge';

const LIMITS = apiPlanSchema.options.map((plan) => API_PLAN_LIMITS[plan]);
const MAX_DAILY = Math.max(...LIMITS.map(({ requestsPerDay }) => requestsPerDay));

describe('planGauge', () => {
  it('fills the gauge for the largest plan', () => {
    expect(planGauge({ value: MAX_DAILY, max: MAX_DAILY })).toBe(1);
  });

  it('grows with the plan and stays inside the gauge', () => {
    const shares = LIMITS.map(({ requestsPerDay }) => planGauge({ value: requestsPerDay, max: MAX_DAILY }));

    shares.forEach((share, index) => {
      expect(share).toBeGreaterThan(0);
      expect(share).toBeLessThanOrEqual(1);
      expect(share).toBeGreaterThanOrEqual(shares[index - 1] ?? 0);
    });
  });

  it('keeps a small plan visible on a log scale', () => {
    expect(planGauge({ value: LIMITS[0]?.requestsPerDay ?? 0, max: MAX_DAILY })).toBeGreaterThan(0.5);
  });

  it('reads zero, one and a degenerate maximum as an empty gauge', () => {
    expect(planGauge({ value: 0, max: MAX_DAILY })).toBe(0);
    expect(planGauge({ value: 1, max: MAX_DAILY })).toBe(0);
    expect(planGauge({ value: 5, max: 1 })).toBe(0);
  });
});
