import type { NodeStateInput, TreeElementState, TreeFlowInput } from './tree-flow.types';

import { pathEdgeKeys } from '../tree-path';

const nodeState = ({ id, path }: NodeStateInput): TreeElementState => {
  if (path.length === 0) {
    return 'idle';
  }

  if (path.at(-1) === id) {
    return 'selected';
  }

  return path.includes(id) ? 'path' : 'dimmed';
};

export const toFlowElements = ({ tree, layout, path }: TreeFlowInput) => {
  const onPath = pathEdgeKeys(path);

  const nodes = tree.nodes.flatMap((node) => {
    const position = layout.positions.get(node.vehicle.tankId);

    return position
      ? [
          {
            id: String(node.vehicle.tankId),
            type: 'tank' as const,
            position,
            data: { node, state: nodeState({ id: node.vehicle.tankId, path }) }
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
        data: { xp, state }
      };
    });

  return { nodes, edges };
};
