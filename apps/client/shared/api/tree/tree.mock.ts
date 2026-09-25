import type { TechTree } from '@bronevik/schemas';

import { isNation } from '@bronevik/icons';

import { mockTechTree, mockVehicleSummary } from '@/shared/mocks';

import { TREE_MOCK } from './tree.constants';

export const mockTree = (nation: string): TechTree | null => {
  if (!isNation(nation)) {
    return null;
  }

  const { tanks, premiums, edges } = mockTechTree(nation);

  if (tanks.length === 0 && premiums.length === 0) {
    return null;
  }

  const tierOf = new Map(tanks.map((tank) => [tank.id, tank.tier]));
  const treeEdges = edges.map(({ from, to }) => ({ from, to, xp: TREE_MOCK.xpByTier[tierOf.get(to) ?? 0] ?? null }));
  const parentsOf = (tankId: number) => treeEdges.filter(({ to }) => to === tankId);

  return {
    nation,
    nodes: [
      ...tanks.map((tank) => {
        const incoming = parentsOf(tank.id);

        return {
          vehicle: mockVehicleSummary(tank),
          xp: incoming.length > 0 ? Math.min(...incoming.map(({ xp }) => xp ?? 0)) : null,
          credits: incoming.length > 0 ? (TREE_MOCK.creditsByTier[tank.tier] ?? null) : null,
          gold: null,
          parents: incoming.map(({ from }) => from),
          children: treeEdges.filter(({ from }) => from === tank.id).map(({ to }) => to)
        };
      }),
      ...premiums.map((tank) => ({
        vehicle: mockVehicleSummary(tank),
        xp: null,
        credits: null,
        gold: tank.tier * TREE_MOCK.goldPerTier,
        parents: [],
        children: []
      }))
    ],
    edges: treeEdges
  };
};
