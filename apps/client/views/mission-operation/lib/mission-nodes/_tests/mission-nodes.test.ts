import type { Mission, MissionProgressItem } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { doneCount, missionNodes } from '../mission-nodes';

const mission = (questId: number, position: number, requiredUnlocks: number[] = []): Mission => ({
  questId,
  name: `q${questId}`,
  campaignId: 1,
  operationId: 1,
  chainId: 1,
  position,
  title: `Mission ${position}`,
  shortTitle: null,
  description: null,
  advice: null,
  minTier: 5,
  maxTier: 10,
  vehicleTypes: [],
  isInitial: requiredUnlocks.length === 0,
  isFinal: false,
  hasHonors: true,
  requiredUnlocks,
  metric: 'damage',
  conditions: []
});

const item = (questId: number, honors = false): [number, MissionProgressItem] => [
  questId,
  { questId, done: true, honors, source: 'manual', updatedAt: '2026-09-26T00:00:00.000Z' }
];

const missions = [mission(3, 3, [2]), mission(1, 1), mission(2, 2, [1])];

describe('missionNodes', () => {
  it('orders by position and marks everything available when progress is not tracked', () => {
    const nodes = missionNodes({ missions, progress: new Map(), isTracked: false });

    expect(nodes.map((node) => node.mission.questId)).toEqual([1, 2, 3]);
    expect(nodes.every((node) => node.state === 'available')).toBe(true);
  });

  it('marks done, honors, the current mission and locked ones', () => {
    const nodes = missionNodes({ missions, progress: new Map([item(1, true)]), isTracked: true });

    expect(nodes.map((node) => node.state)).toEqual(['honors', 'current', 'locked']);
    expect(doneCount(nodes)).toBe(1);
  });

  it('keeps plain done apart from honors', () => {
    const nodes = missionNodes({ missions, progress: new Map([item(1), item(2)]), isTracked: true });

    expect(nodes.map((node) => node.state)).toEqual(['done', 'done', 'current']);
    expect(doneCount(nodes)).toBe(2);
  });
});
