import { describe, expect, it } from 'vitest';

import { operationProgress } from '../operation-progress';

const item = (questId: number, done: boolean, honors: boolean) => ({
  questId,
  done,
  honors,
  source: 'manual' as const,
  updatedAt: '2026-09-26T00:00:00.000Z'
});

describe('operationProgress', () => {
  it('counts only the missions of the operation', () => {
    expect(operationProgress({ questIds: [1, 2, 3], items: [item(1, true, true), item(2, true, false), item(40, true, true)] })).toEqual({
      total: 3,
      done: 2,
      honors: 1
    });
  });

  it('is empty without progress', () => {
    expect(operationProgress({ questIds: [], items: [] })).toEqual({ total: 0, done: 0, honors: 0 });
  });
});
