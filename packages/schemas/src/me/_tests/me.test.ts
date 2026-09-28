import { describe, expect, it } from 'vitest';

import { isGoalTankMetric } from '../me';
import { createGoalSchema, goalMetricSchema } from '../me.schemas';

const GOAL_BODY = { accountId: 1, target: 85, endsAt: '2026-10-01T00:00:00.000Z' };

describe('createGoalSchema', () => {
  it('refuses a moe goal without a tank', () => {
    const result = createGoalSchema.safeParse({ ...GOAL_BODY, metric: 'moe' });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain('tankId');
  });

  it('accepts a moe goal on a tank', () => {
    expect(createGoalSchema.safeParse({ ...GOAL_BODY, metric: 'moe', tankId: 1 }).success).toBe(true);
  });

  it('keeps the tank optional for every other metric', () => {
    goalMetricSchema.options
      .filter((metric) => !isGoalTankMetric(metric))
      .forEach((metric) => {
        expect(createGoalSchema.safeParse({ ...GOAL_BODY, metric }).success).toBe(true);
      });
  });
});
