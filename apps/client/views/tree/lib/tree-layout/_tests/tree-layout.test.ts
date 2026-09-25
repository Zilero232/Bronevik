import type { TechTreeEdge, TechTreeNode, VehicleSummary } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { TREE_LAYOUT } from '../../../config';
import { layoutTree, tierColumnX } from '../tree-layout';

const node = (tankId: number, tier: number): TechTreeNode => ({
  vehicle: {
    tankId,
    tier,
    name: `T${tankId}`,
    shortName: `T${tankId}`,
    slug: `t-${tankId}`,
    nation: 'ussr',
    type: 'mediumTank',
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  } satisfies VehicleSummary,
  xp: tier * 100,
  credits: tier * 1000,
  gold: null,
  parents: [],
  children: []
});

const NODES = [node(1, 1), node(2, 2), node(3, 2), node(4, 3), node(5, 3), node(6, 5), node(7, 3)];

const EDGES: TechTreeEdge[] = [
  { from: 1, to: 2, xp: 200 },
  { from: 1, to: 3, xp: 200 },
  { from: 2, to: 4, xp: 300 },
  { from: 3, to: 5, xp: 300 },
  { from: 3, to: 7, xp: 300 },
  { from: 5, to: 6, xp: 500 },
  { from: 99, to: 6, xp: 500 }
];

const LAYOUT = layoutTree({ nodes: NODES, edges: EDGES });

const positionOf = (id: number) => LAYOUT.positions.get(id);

describe('layoutTree', () => {
  it('places every node of the tree', () => {
    expect(LAYOUT.positions.size).toBe(NODES.length);
  });

  it('puts every tank of one tier in the same column', () => {
    expect(positionOf(4)?.x).toBe(positionOf(5)?.x);
    expect(positionOf(4)?.x).toBe(tierColumnX(3));
  });

  it('moves higher tiers further to the right, even when a tier is skipped', () => {
    expect(positionOf(6)?.x).toBe(tierColumnX(5));
    expect(tierColumnX(5)).toBeGreaterThan(tierColumnX(3));
  });

  it('never lets two tanks of one column overlap', () => {
    const ys = [4, 5, 7].map((id) => positionOf(id)?.y ?? 0).sort((a, b) => a - b);

    ys.slice(1).forEach((y, index) => expect(y - ys[index]).toBeGreaterThanOrEqual(TREE_LAYOUT.nodeHeight));
  });

  it('starts the layout at the top edge', () => {
    expect(Math.min(...[...LAYOUT.positions.values()].map(({ y }) => y))).toBe(0);
  });

  it('lists every tier between the lowest and the highest for the ruler', () => {
    expect(LAYOUT.tiers).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps separate chains of one tier apart when they have no edges between them', () => {
    const lonely = layoutTree({ nodes: [node(10, 8), node(11, 8), node(12, 8)], edges: [] });
    const ys = [...lonely.positions.values()].map(({ y }) => y);

    expect(new Set(ys).size).toBe(ys.length);
  });

  it('returns an empty layout for a nation without tanks', () => {
    expect(layoutTree({ nodes: [], edges: [] }).positions.size).toBe(0);
  });
});
