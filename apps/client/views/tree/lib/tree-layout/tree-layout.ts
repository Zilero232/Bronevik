import { graphlib, layout } from '@dagrejs/dagre';
import { groupBy, range, sortBy } from 'remeda';

import type { LayoutTreeInput, NodePosition, TreeLayout } from './tree-layout.types';

import { TREE_LAYOUT } from '../../config';

const { nodeWidth, nodeHeight, columnGap, rowGap } = TREE_LAYOUT;

export const tierColumnX = (tier: number) => (tier - 1) * (nodeWidth + columnGap);

const settleColumn = (column: { id: number; y: number }[]) =>
  sortBy(column, ({ y }) => y).reduce<{ id: number; y: number }[]>((placed, { id, y }) => {
    const previous = placed.at(-1);
    const floor = previous ? previous.y + nodeHeight + rowGap : Number.NEGATIVE_INFINITY;

    return [...placed, { id, y: Math.max(y, floor) }];
  }, []);

export const layoutTree = ({ nodes, edges }: LayoutTreeInput): TreeLayout => {
  if (nodes.length === 0) {
    return { positions: new Map(), tiers: [], width: 0, height: 0 };
  }

  const tierOf = new Map(nodes.map(({ vehicle }) => [vehicle.tankId, vehicle.tier]));
  const graph = new graphlib.Graph();

  graph.setGraph({ rankdir: 'LR', nodesep: rowGap, ranksep: columnGap, marginx: 0, marginy: 0 });
  graph.setDefaultEdgeLabel(() => ({}));
  nodes.forEach(({ vehicle }) => graph.setNode(String(vehicle.tankId), { width: nodeWidth, height: nodeHeight }));

  edges.forEach(({ from, to }) => {
    const fromTier = tierOf.get(from);
    const toTier = tierOf.get(to);

    if (fromTier !== undefined && toTier !== undefined) {
      graph.setEdge(String(from), String(to), { minlen: Math.max(1, toTier - fromTier) });
    }
  });

  layout(graph);

  const raw = nodes.map(({ vehicle }) => ({ id: vehicle.tankId, tier: vehicle.tier, y: Number(graph.node(String(vehicle.tankId))?.y ?? 0) }));
  const columns = Object.values(groupBy(raw, ({ tier }) => tier)).flatMap((column) => settleColumn(column));
  const top = Math.min(...columns.map(({ y }) => y));
  const positions = new Map<number, NodePosition>(columns.map(({ id, y }) => [id, { x: tierColumnX(tierOf.get(id) ?? 1), y: y - top }]));
  const tiers = [...tierOf.values()];
  const maxTier = Math.max(...tiers);
  const bottom = Math.max(...[...positions.values()].map(({ y }) => y));

  return {
    positions,
    tiers: range(Math.min(...tiers), maxTier + 1),
    width: tierColumnX(maxTier) + nodeWidth,
    height: bottom + nodeHeight
  };
};
