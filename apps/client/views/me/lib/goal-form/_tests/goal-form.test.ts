import { createGoalSchema, goalMetricSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { GOAL_METRICS } from '../../../config';
import { goalFormSchema, isPercentMetric } from '../goal-form';

const BASE = { accountId: 1, endsAt: '2026-10-01T00:00:00Z' };

describe('goalFormSchema', () => {
  it('reads the target typed into the form as a number', () => {
    const parsed = goalFormSchema.parse({ ...BASE, metric: 'wn8', target: '3600' });

    expect(parsed.target).toBe(3_600);
  });

  it('produces a body the API accepts', () => {
    const parsed = goalFormSchema.parse({ ...BASE, metric: 'battles', target: '500' });

    expect(createGoalSchema.safeParse(parsed).success).toBe(true);
  });

  it('rejects an empty or non-positive target', () => {
    expect(goalFormSchema.safeParse({ ...BASE, metric: 'wn8', target: '' }).success).toBe(false);
    expect(goalFormSchema.safeParse({ ...BASE, metric: 'wn8', target: '-5' }).success).toBe(false);
  });

  it('caps percent goals at one hundred percent and leaves the rest open', () => {
    const above = String(GOAL_METRICS.percentMax + 1);

    goalMetricSchema.options.forEach((metric) => {
      expect(goalFormSchema.safeParse({ ...BASE, metric, target: above }).success).toBe(!isPercentMetric(metric));
    });
  });
});
