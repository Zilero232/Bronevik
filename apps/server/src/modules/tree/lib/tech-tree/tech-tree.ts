import type { TechTree, TechTreeEdge } from '@bronevik/schemas';

import { sortBy } from 'remeda';

import type { BuildTechTreeInput, EdgeEnds } from './tech-tree.types';

import { nextTanksSchema } from './tech-tree.schemas';

const edgeKey = ({ from, to }: EdgeEnds): string => `${from}>${to}`;

export const buildTechTree = ({ nation, vehicles, summaries }: BuildTechTreeInput): TechTree => {
  const known = new Set(vehicles.map((vehicle) => vehicle.tankId).filter((tankId) => summaries.has(tankId)));
  const edges = new Map<string, TechTreeEdge>();

  for (const vehicle of vehicles) {
    if (!known.has(vehicle.tankId)) {
      continue;
    }

    for (const next of nextTanksSchema.parse(vehicle.nextTanks ?? [])) {
      if (known.has(next.tankId)) {
        edges.set(edgeKey({ from: vehicle.tankId, to: next.tankId }), {
          from: vehicle.tankId,
          to: next.tankId,
          xp: next.xp === undefined ? null : Math.round(next.xp)
        });
      }
    }

    for (const parent of vehicle.prevTankIds) {
      if (known.has(parent) && !edges.has(edgeKey({ from: parent, to: vehicle.tankId }))) {
        edges.set(edgeKey({ from: parent, to: vehicle.tankId }), { from: parent, to: vehicle.tankId, xp: null });
      }
    }
  }

  const edgeList = [...edges.values()];

  const nodes = vehicles.flatMap((vehicle) => {
    const summary = summaries.get(vehicle.tankId);

    if (!summary) {
      return [];
    }

    const incoming = edgeList.filter((edge) => edge.to === vehicle.tankId);
    const costs = incoming.flatMap((edge) => (edge.xp === null ? [] : [edge.xp]));

    return [
      {
        vehicle: summary,
        xp: costs.length > 0 ? Math.min(...costs) : null,
        credits: vehicle.priceCredit !== null && vehicle.priceCredit > 0 ? vehicle.priceCredit : null,
        gold: vehicle.priceGold !== null && vehicle.priceGold > 0 ? vehicle.priceGold : null,
        parents: incoming.map((edge) => edge.from),
        children: edgeList.filter((edge) => edge.from === vehicle.tankId).map((edge) => edge.to)
      }
    ];
  });

  return {
    nation,
    nodes: sortBy(
      nodes,
      (node) => node.vehicle.tier,
      (node) => node.vehicle.type,
      (node) => node.vehicle.name
    ),
    edges: edgeList
  };
};
