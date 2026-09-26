import type { TechTreeEdge } from '@otmetki/schemas';

import { firstBy, sumBy } from 'remeda';

import type { PathCost, PathCostInput, PathRoute, PathToInput, RouteToInput } from './tree-path.types';

const parentsOf = (edges: TechTreeEdge[]) =>
  edges.reduce((parents, { from, to }) => parents.set(to, [...(parents.get(to) ?? []), from]), new Map<number, number[]>());

export const pathTo = ({ nodes, edges, targetId }: PathToInput): number[] => {
  const xpOf = new Map(nodes.map(({ vehicle, xp }) => [vehicle.tankId, xp ?? 0]));

  if (!xpOf.has(targetId)) {
    return [];
  }

  const parents = parentsOf(edges);
  const routes = new Map<number, PathRoute>();

  const routeTo = ({ id, visiting }: RouteToInput): PathRoute => {
    const known = routes.get(id);

    if (known) {
      return known;
    }

    const candidates = (parents.get(id) ?? []).filter((parent) => xpOf.has(parent) && !visiting.has(parent));
    const best = firstBy(
      candidates.map((parent) => routeTo({ id: parent, visiting: new Set([...visiting, id]) })),
      ({ cost }) => cost
    );

    const route = best ? { ids: [...best.ids, id], cost: best.cost + (xpOf.get(id) ?? 0) } : { ids: [id], cost: 0 };

    routes.set(id, route);

    return route;
  };

  return routeTo({ id: targetId, visiting: new Set() }).ids;
};

export const pathCost = ({ nodes, path }: PathCostInput): PathCost => {
  const byId = new Map(nodes.map((node) => [node.vehicle.tankId, node]));
  const researched = path.slice(1).flatMap((id) => byId.get(id) ?? []);

  return {
    xp: sumBy(researched, ({ xp }) => xp ?? 0),
    credits: sumBy(researched, ({ credits }) => credits ?? 0),
    steps: researched.length
  };
};

export const pathEdgeKeys = (path: number[]) => new Set(path.slice(1).map((id, index) => `${path[index]}-${id}`));
