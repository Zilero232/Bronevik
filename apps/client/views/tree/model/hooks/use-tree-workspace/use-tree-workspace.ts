'use client';

import type { TechTree } from '@otmetki/schemas';

import { pathCost, pathTo } from '../../../lib/tree-path';
import { useTreeParams } from '../use-tree-params';

export const useTreeWorkspace = (tree: TechTree) => {
  const { selectedId, selectTank } = useTreeParams();

  const path = selectedId === null ? [] : pathTo({ nodes: tree.nodes, edges: tree.edges, targetId: selectedId });
  const byId = new Map(tree.nodes.map((node) => [node.vehicle.tankId, node]));
  const steps = path.flatMap((id) => byId.get(id) ?? []);

  const onClear = () => selectTank(null);

  return { path, steps, selected: steps.at(-1) ?? null, cost: pathCost({ nodes: tree.nodes, path }), selectTank, onClear };
};
