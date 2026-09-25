import { NATIONS } from '@bronevik/icons';
import { techTreeSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { mockTree } from '../tree.mock';

const sorted = (ids: readonly number[]) => [...ids].sort((a, b) => a - b);

const TREES = NATIONS.flatMap((nation) => mockTree(nation) ?? []);

describe('tree mocks', () => {
  it('answer every nation in the shape the API contract promises', () => {
    TREES.forEach((tree) => expect(() => techTreeSchema.parse(tree)).not.toThrow());
  });

  it('cover at least one nation', () => {
    expect(TREES.length).toBeGreaterThan(0);
  });

  it('report an unknown nation as missing', () => {
    expect(mockTree('atlantis')).toBeNull();
  });

  it('only draw edges between nodes of the same tree', () => {
    TREES.forEach(({ nodes, edges }) => {
      const ids = new Set(nodes.map(({ vehicle }) => vehicle.tankId));

      edges.forEach(({ from, to }) => expect(ids.has(from) && ids.has(to)).toBe(true));
    });
  });

  it('list the same links on the nodes as on the edges', () => {
    TREES.forEach(({ nodes, edges }) => {
      nodes.forEach(({ vehicle, parents, children }) => {
        expect(sorted(parents)).toEqual(sorted(edges.filter(({ to }) => to === vehicle.tankId).map(({ from }) => from)));
        expect(sorted(children)).toEqual(sorted(edges.filter(({ from }) => from === vehicle.tankId).map(({ to }) => to)));
      });
    });
  });

  it('sell premium vehicles for gold instead of researching them', () => {
    TREES.flatMap(({ nodes }) => nodes)
      .filter(({ vehicle }) => vehicle.isPremium)
      .forEach(({ xp, gold, parents }) => {
        expect(xp).toBeNull();
        expect(gold).not.toBeNull();
        expect(parents).toEqual([]);
      });
  });
});
