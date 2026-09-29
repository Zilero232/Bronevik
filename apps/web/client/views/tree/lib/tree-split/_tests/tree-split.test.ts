import type { TechTree, TechTreeNode } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { splitTree } from '../tree-split';

const node = ({
  tankId,
  tier = 5,
  isPremium = false,
  parents = [],
  children = []
}: Partial<TechTreeNode['vehicle']> & Partial<Pick<TechTreeNode, 'children' | 'parents'>> & { tankId: number }): TechTreeNode => ({
  vehicle: {
    tankId,
    tier,
    name: `T${tankId}`,
    shortName: `T${tankId}`,
    slug: `t-${tankId}`,
    nation: 'ussr',
    type: 'mediumTank',
    isPremium,
    isCollectible: false,
    status: 'researchable',
    images: { small: null, contour: null, big: null }
  },
  xp: null,
  credits: null,
  gold: isPremium ? 1_000 : null,
  parents,
  children
});

const TREE: TechTree = {
  nation: 'ussr',
  nodes: [
    node({ tankId: 1, tier: 1, children: [2] }),
    node({ tankId: 2, tier: 2, parents: [1] }),
    node({ tankId: 3, tier: 6, isPremium: true }),
    node({ tankId: 4, tier: 8, isPremium: true }),
    node({ tankId: 5, tier: 3 })
  ],
  edges: [{ from: 1, to: 2, xp: 100 }]
};

const ids = (nodes: TechTreeNode[]) => nodes.map(({ vehicle }) => vehicle.tankId);

describe('splitTree', () => {
  it('keeps only linked vehicles on the canvas', () => {
    expect(ids(splitTree(TREE).tree.nodes)).toEqual([1, 2]);
  });

  it('moves premium vehicles without links to the strip, highest tier first', () => {
    expect(ids(splitTree(TREE).premiums)).toEqual([4, 3]);
  });

  it('drops a regular vehicle that is linked to nothing', () => {
    const { tree, premiums } = splitTree(TREE);

    expect([...ids(tree.nodes), ...ids(premiums)]).not.toContain(5);
  });

  it('keeps a premium vehicle that sits inside a branch on the canvas', () => {
    const linked = { ...TREE, nodes: [...TREE.nodes, node({ tankId: 6, isPremium: true, parents: [2] })] };

    expect(ids(splitTree(linked).tree.nodes)).toContain(6);
  });

  it('keeps the edges untouched', () => {
    expect(splitTree(TREE).tree.edges).toEqual(TREE.edges);
  });
});
