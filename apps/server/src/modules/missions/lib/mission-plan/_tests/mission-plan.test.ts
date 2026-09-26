import { describe, expect, it } from 'vitest';

import type { PlanBranch } from '../mission-plan.types';

import { planOperation } from '../mission-plan';

const branch = (chainId: number, count: number): PlanBranch => ({
  chainId,
  key: `chain${chainId}`,
  missions: Array.from({ length: count }, (_, index) => ({
    questId: chainId * 100 + index + 1,
    chainId,
    position: index + 1,
    title: `${chainId}-${index + 1}`,
    shortTitle: null,
    hasHonors: true
  }))
});

describe('planOperation', () => {
  it('starts with the branch closest to completion and keeps mission order inside a branch', () => {
    const progress = new Map([
      [101, { done: true, honors: true }],
      [102, { done: true, honors: false }]
    ]);

    const steps = planOperation({ branches: [branch(2, 3), branch(1, 3)], progress });

    expect(steps.map((step) => step.questId)).toEqual([103, 201, 202, 203, 102]);
    expect(steps.at(-1)?.withHonors).toBe(true);
  });

  it('prefers the branch the hangar covers better when progress is equal', () => {
    const steps = planOperation({ branches: [branch(1, 1), branch(2, 1)], progress: new Map(), coverage: new Map([[2, 4]]) });

    expect(steps.map((step) => step.chainId)).toEqual([2, 1]);
  });

  it('returns nothing once every mission is done with honors', () => {
    expect(planOperation({ branches: [branch(1, 1)], progress: new Map([[101, { done: true, honors: true }]]) })).toEqual([]);
  });
});
