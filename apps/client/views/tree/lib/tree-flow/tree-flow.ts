import type { TreeElementState, TreeFlowInput } from './tree-flow.types';

import { TREE_MOTION } from '../../config';
import { pathEdgeKeys } from '../tree-path';

const nodeState = ({ id, path }: { id: number; path: number[] }): TreeElementState => {
  if (path.length === 0) {
    return 'idle';
  }

  if (path.at(-1) === id) {
    return 'selected';
  }

  return path.includes(id) ? 'path' : 'dimmed';
};

export const toFlowElements = ({ tree, layout, path, onSelect }: TreeFlowInput) => {
  const firstTier = layout.tiers[0] ?? 1;
  const tierOf = new Map(tree.nodes.map(({ vehicle }) => [vehicle.tankId, vehicle.tier]));
  const onPath = pathEdgeKeys(path);
  const delayOf = (tier: number) => (tier - firstTier) * TREE_MOTION.tierStep;

  const nodes = tree.nodes.flatMap((node) => {
    const position = layout.positions.get(node.vehicle.tankId);

    return position
      ? [
          {
            id: String(node.vehicle.tankId),
            type: 'tank' as const,
            position,
            data: { node, state: nodeState({ id: node.vehicle.tankId, path }), delay: delayOf(node.vehicle.tier), onSelect }
          }
        ]
      : [];
  });

  const edges = tree.edges
    .filter(({ from, to }) => layout.positions.has(from) && layout.positions.has(to))
    .map(({ from, to, xp }) => {
      const key = `${from}-${to}`;
      const isOnPath = onPath.has(key);
      const state: TreeElementState = path.length === 0 ? 'idle' : isOnPath ? 'path' : 'dimmed';

      return {
        id: key,
        source: String(from),
        target: String(to),
        type: 'branch' as const,
        zIndex: isOnPath ? 1 : 0,
        data: { xp, state, delay: delayOf(tierOf.get(from) ?? firstTier) + TREE_MOTION.edgeLag }
      };
    });

  return { nodes, edges };
};
