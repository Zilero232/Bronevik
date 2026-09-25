import { describe, expect, it } from 'vitest';

import { ACTIVITY_LIMITS, ACTIVITY_STATUSES } from '../../../config';
import { activityDistribution, activityStatus } from '../activity-status';

describe('activityStatus', () => {
  it('treats a player who fought today as active', () => {
    expect(activityStatus(0)).toBe('active');
  });

  it('keeps each limit inside its own bucket', () => {
    expect(activityStatus(ACTIVITY_LIMITS.active)).toBe('active');
    expect(activityStatus(ACTIVITY_LIMITS.recent)).toBe('recent');
    expect(activityStatus(ACTIVITY_LIMITS.idle)).toBe('idle');
  });

  it('moves to the next bucket one day past a limit', () => {
    expect(activityStatus(ACTIVITY_LIMITS.active + 1)).toBe('recent');
    expect(activityStatus(ACTIVITY_LIMITS.recent + 1)).toBe('idle');
    expect(activityStatus(ACTIVITY_LIMITS.idle + 1)).toBe('gone');
  });

  it('counts a member without a known last battle as gone', () => {
    expect(activityStatus(null)).toBe('gone');
  });

  it('never gets less active as the idle streak grows', () => {
    const order = Array.from({ length: 90 }, (_, days) => ACTIVITY_STATUSES.indexOf(activityStatus(days)));

    order.slice(1).forEach((rank, index) => expect(rank).toBeGreaterThanOrEqual(order[index] ?? 0));
  });
});

describe('activityDistribution', () => {
  it('reports every bucket even when it is empty', () => {
    expect(Object.keys(activityDistribution([]))).toEqual([...ACTIVITY_STATUSES]);
  });

  it('accounts for every member exactly once', () => {
    const days = [0, 3, 12, 45, null, 1];
    const counts = activityDistribution(days);

    expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(days.length);
  });

  it('puts members into the bucket their idle streak belongs to', () => {
    expect(activityDistribution([0, 0, 45])).toMatchObject({ active: 2, gone: 1 });
  });
});
