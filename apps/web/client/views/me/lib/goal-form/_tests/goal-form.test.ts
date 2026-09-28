import { createGoalSchema, goalMetricSchema } from '@otmetki/schemas';
import { differenceInCalendarDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { GOAL_FORM, GOAL_METRICS } from '../../../config';
import { goalFormSchema, isPercentMetric, toGoalInput } from '../goal-form';

const BASE = { duration: GOAL_FORM.defaultValues.duration };
const NOW = new Date('2026-09-01T00:00:00Z');

describe('goalFormSchema', () => {
  it('reads the target typed into the form as a number', () => {
    const parsed = goalFormSchema.parse({ ...BASE, metric: 'wn8', target: '3600' });

    expect(parsed.target).toBe(3_600);
  });

  it('rejects an empty or non-positive target', () => {
    expect(goalFormSchema.safeParse({ ...BASE, metric: 'wn8', target: '' }).success).toBe(false);
    expect(goalFormSchema.safeParse({ ...BASE, metric: 'wn8', target: '-5' }).success).toBe(false);
  });

  it('caps percent goals at one hundred percent and leaves the rest open', () => {
    const above = String(GOAL_METRICS.percentMax + 1);

    goalMetricSchema.options.forEach((metric) => {
      expect(goalFormSchema.safeParse({ ...BASE, metric, tankId: 1, target: above }).success).toBe(!isPercentMetric(metric));
    });
  });

  it('requires a tank for a moe goal', () => {
    const result = goalFormSchema.safeParse({ ...BASE, metric: 'moe', target: '85' });

    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain('tankId');
    expect(goalFormSchema.safeParse({ ...BASE, metric: 'moe', tankId: 1, target: '85' }).success).toBe(true);
  });

  it('accepts only the offered durations', () => {
    GOAL_FORM.durations.forEach((duration) => {
      expect(goalFormSchema.safeParse({ metric: 'wn8', target: '1', duration }).success).toBe(true);
    });

    expect(goalFormSchema.safeParse({ metric: 'wn8', target: '1', duration: '1000' }).success).toBe(false);
  });
});

describe('toGoalInput', () => {
  it('produces a body the API accepts', () => {
    const values = goalFormSchema.parse({ ...BASE, metric: 'battles', target: '500' });

    expect(createGoalSchema.safeParse(toGoalInput({ values, accountId: 1, now: NOW })).success).toBe(true);
  });

  it('sends the tank of a moe goal and drops it from the other metrics', () => {
    const moe = goalFormSchema.parse({ ...BASE, metric: 'moe', tankId: 7, target: '85' });
    const wn8 = goalFormSchema.parse({ ...BASE, metric: 'wn8', tankId: 7, target: '2000' });

    expect(createGoalSchema.safeParse(toGoalInput({ values: moe, accountId: 1, now: NOW })).success).toBe(true);
    expect(toGoalInput({ values: moe, accountId: 1, now: NOW }).tankId).toBe(7);
    expect(toGoalInput({ values: wn8, accountId: 1, now: NOW })).not.toHaveProperty('tankId');
  });

  it('ends the goal the chosen number of days from now', () => {
    GOAL_FORM.durations.forEach((duration) => {
      const values = goalFormSchema.parse({ metric: 'wn8', target: '1', duration });
      const { endsAt } = toGoalInput({ values, accountId: 1, now: NOW });

      expect(differenceInCalendarDays(new Date(endsAt), NOW)).toBe(Number(duration));
    });
  });
});
