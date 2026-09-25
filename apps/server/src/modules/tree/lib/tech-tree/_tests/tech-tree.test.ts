import type { VehicleSummary } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import type { TreeVehicleRow } from '../tech-tree.types';

import { buildTechTree } from '../tech-tree';

const summary = (tankId: number): VehicleSummary => ({
  tankId,
  name: `Tank ${tankId}`,
  shortName: `T${tankId}`,
  slug: `tank-${tankId}`,
  nation: 'ussr',
  type: 'mediumTank',
  tier: tankId,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
});

const vehicle = ({
  tankId,
  nextTanks = [],
  prevTankIds = [],
  priceCredit = null,
  priceGold = null
}: Partial<TreeVehicleRow> & Pick<TreeVehicleRow, 'tankId'>): TreeVehicleRow => ({
  tankId,
  nextTanks,
  prevTankIds,
  priceCredit,
  priceGold
});

const summaries = new Map([1, 2, 3].map((tankId) => [tankId, summary(tankId)]));

describe('buildTechTree', () => {
  it('draws an edge with its research cost from the next tanks', () => {
    const tree = buildTechTree({
      nation: 'ussr',
      summaries,
      vehicles: [vehicle({ tankId: 1, nextTanks: [{ tankId: 2, xp: 1_200.4 }] }), vehicle({ tankId: 2 })]
    });

    expect(tree.edges).toEqual([{ from: 1, to: 2, xp: Math.round(1_200.4) }]);
  });

  it('draws an edge without a cost from the previous tanks', () => {
    const tree = buildTechTree({ nation: 'ussr', summaries, vehicles: [vehicle({ tankId: 1 }), vehicle({ tankId: 2, prevTankIds: [1] })] });

    expect(tree.edges).toEqual([{ from: 1, to: 2, xp: null }]);
  });

  it('keeps the costed edge when both sides describe the same link', () => {
    const tree = buildTechTree({
      nation: 'ussr',
      summaries,
      vehicles: [vehicle({ tankId: 2, prevTankIds: [1] }), vehicle({ tankId: 1, nextTanks: [{ tankId: 2, xp: 500 }] })]
    });

    expect(tree.edges).toEqual([{ from: 1, to: 2, xp: 500 }]);
  });

  it('drops edges to vehicles without a summary', () => {
    const tree = buildTechTree({
      nation: 'ussr',
      summaries,
      vehicles: [vehicle({ tankId: 1, nextTanks: [{ tankId: 99, xp: 100 }] }), vehicle({ tankId: 2, prevTankIds: [98] }), vehicle({ tankId: 97 })]
    });

    expect(tree.edges).toEqual([]);
    expect(tree.nodes.map((node) => node.vehicle.tankId)).toEqual([1, 2]);
  });

  it('prices a node by its cheapest incoming research', () => {
    const tree = buildTechTree({
      nation: 'ussr',
      summaries,
      vehicles: [
        vehicle({ tankId: 1, nextTanks: [{ tankId: 3, xp: 900 }] }),
        vehicle({ tankId: 2, nextTanks: [{ tankId: 3, xp: 700 }] }),
        vehicle({ tankId: 3 })
      ]
    });

    const node = tree.nodes.find((item) => item.vehicle.tankId === 3);

    expect(node?.xp).toBe(700);
    expect(node?.parents).toEqual([1, 2]);
    expect(tree.nodes.find((item) => item.vehicle.tankId === 1)?.children).toEqual([3]);
  });

  it('leaves the research cost unknown when no incoming edge has one', () => {
    const tree = buildTechTree({ nation: 'ussr', summaries, vehicles: [vehicle({ tankId: 1 }), vehicle({ tankId: 2, prevTankIds: [1] })] });

    expect(tree.nodes.map((node) => node.xp)).toEqual([null, null]);
  });

  it('treats a zero price as no price', () => {
    const [node] = buildTechTree({ nation: 'ussr', summaries, vehicles: [vehicle({ tankId: 1, priceCredit: 0, priceGold: 7_500 })] }).nodes;

    expect(node?.credits).toBeNull();
    expect(node?.gold).toBe(7_500);
  });

  it('ignores malformed next tanks', () => {
    const tree = buildTechTree({ nation: 'ussr', summaries, vehicles: [vehicle({ tankId: 1, nextTanks: 'broken' }), vehicle({ tankId: 2 })] });

    expect(tree.edges).toEqual([]);
  });

  it('orders nodes by tier', () => {
    const tree = buildTechTree({ nation: 'ussr', summaries, vehicles: [vehicle({ tankId: 3 }), vehicle({ tankId: 1 }), vehicle({ tankId: 2 })] });

    expect(tree.nodes.map((node) => node.vehicle.tier)).toEqual([1, 2, 3]);
  });
});
