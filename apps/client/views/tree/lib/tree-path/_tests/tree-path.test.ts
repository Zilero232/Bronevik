import type { TechTreeEdge, TechTreeNode, VehicleSummary } from '@bronevik/schemas';

import { sumBy } from 'remeda';
import { describe, expect, it } from 'vitest';

import { pathCost, pathTo } from '../tree-path';

const node = ({ tankId, tier, xp }: { tankId: number; tier: number; xp: number | null }): TechTreeNode => ({
  vehicle: {
    tankId,
    tier,
    name: `T${tankId}`,
    shortName: `T${tankId}`,
    slug: `t-${tankId}`,
    nation: 'ussr',
    type: 'heavyTank',
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  } satisfies VehicleSummary,
  xp,
  credits: xp === null ? null : xp * 10,
  gold: null,
  parents: [],
  children: []
});

const NODES = [
  node({ tankId: 1, tier: 1, xp: 0 }),
  node({ tankId: 2, tier: 2, xp: 500 }),
  node({ tankId: 3, tier: 2, xp: 100 }),
  node({ tankId: 4, tier: 3, xp: 1_000 }),
  node({ tankId: 5, tier: 4, xp: 3_000 })
];

const EDGES: TechTreeEdge[] = [
  { from: 1, to: 2, xp: 500 },
  { from: 1, to: 3, xp: 100 },
  { from: 2, to: 4, xp: 1_000 },
  { from: 3, to: 4, xp: 1_000 },
  { from: 4, to: 5, xp: 3_000 }
];

const isEdge = (from: number, to: number) => EDGES.some((edge) => edge.from === from && edge.to === to);

describe('pathTo', () => {
  it('starts at the root and ends at the chosen tank', () => {
    const path = pathTo({ nodes: NODES, edges: EDGES, targetId: 5 });

    expect(path[0]).toBe(1);
    expect(path.at(-1)).toBe(5);
  });

  it('only steps along edges of the tree', () => {
    const path = pathTo({ nodes: NODES, edges: EDGES, targetId: 5 });

    path.slice(1).forEach((id, index) => expect(isEdge(path[index], id)).toBe(true));
  });

  it('goes through the cheaper parent when a tank has several', () => {
    const path = pathTo({ nodes: NODES, edges: EDGES, targetId: 4 });

    expect(path).toContain(3);
    expect(path).not.toContain(2);
  });

  it('returns just the root when the root itself is chosen', () => {
    expect(pathTo({ nodes: NODES, edges: EDGES, targetId: 1 })).toEqual([1]);
  });

  it('returns nothing for a tank outside the tree', () => {
    expect(pathTo({ nodes: NODES, edges: EDGES, targetId: 42 })).toEqual([]);
  });

  it('survives a cycle in broken data', () => {
    const looped = [...EDGES, { from: 5, to: 1, xp: 0 }];

    expect(pathTo({ nodes: NODES, edges: looped, targetId: 5 }).at(-1)).toBe(5);
  });
});

describe('pathCost', () => {
  it('sums experience and credits of every tank after the root', () => {
    const path = [1, 3, 4, 5];
    const researched = NODES.filter(({ vehicle }) => path.slice(1).includes(vehicle.tankId));

    expect(pathCost({ nodes: NODES, path })).toEqual({
      xp: sumBy(researched, ({ xp }) => xp ?? 0),
      credits: sumBy(researched, ({ credits }) => credits ?? 0),
      steps: researched.length
    });
  });

  it('costs nothing for the root alone', () => {
    expect(pathCost({ nodes: NODES, path: [1] })).toEqual({ xp: 0, credits: 0, steps: 0 });
  });

  it('treats a tank with unknown cost as free instead of breaking the sum', () => {
    const nodes = [...NODES, node({ tankId: 6, tier: 5, xp: null })];

    expect(pathCost({ nodes, path: [1, 3, 6] }).xp).toBe(NODES[2].xp);
  });
});
