import type { Mission, MissionBranch, MissionProgressItem } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { operationColumns, operationTotals, selectedNode } from '../operation-board';

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

const branch = (chainId: number, missions: Mission[]): MissionBranch => ({
  chainId,
  kind: 'vehicleClass',
  key: `branch-${chainId}`,
  vehicleType: null,
  nations: [],
  minTier: 5,
  maxTier: 10,
  missions
});

const item = (questId: number, honors = false): [number, MissionProgressItem] => [
  questId,
  { questId, done: true, honors, source: 'manual', updatedAt: '2026-09-26T00:00:00.000Z' }
];

const branches = [branch(1, [mission(1, 1), mission(2, 2, [1])]), branch(2, [mission(3, 1), mission(4, 2, [3])])];
const progress = new Map([item(1, true), item(3)]);
const label = (key: string) => key.toUpperCase();

describe('operationColumns', () => {
  it('builds labelled columns with node states and done counts', () => {
    const columns = operationColumns({ branches, progress, isTracked: true, label });

    expect(columns.map(({ label: text, done }) => ({ text, done }))).toEqual([
      { text: 'BRANCH-1', done: 1 },
      { text: 'BRANCH-2', done: 1 }
    ]);

    expect(columns[0]?.nodes.map((node) => node.state)).toEqual(['honors', 'current']);
  });
});

describe('operationTotals', () => {
  it('counts done and honors across all columns', () => {
    expect(operationTotals(operationColumns({ branches, progress, isTracked: true, label }))).toEqual({ done: 2, honors: 1 });
  });
});

describe('selectedNode', () => {
  const columns = operationColumns({ branches, progress, isTracked: true, label });

  it('picks the mission from the URL', () => {
    expect(selectedNode({ columns, questId: 4 })?.mission.questId).toBe(4);
  });

  it('falls back to the first current mission, then to the first one', () => {
    expect(selectedNode({ columns, questId: 99 })?.mission.questId).toBe(2);
    expect(selectedNode({ columns: operationColumns({ branches, progress, isTracked: false, label }), questId: null })?.mission.questId).toBe(1);
    expect(selectedNode({ columns: [], questId: null })).toBeNull();
  });
});
