'use client';

import type { NodeMouseHandler, OnInit } from '@xyflow/react';

import { useStoreApi } from '@xyflow/react';

import type { BranchFlowEdge, TankFlowNode } from '../../../lib/tree-flow';

import { toFlowElements } from '../../../lib/tree-flow';
import { initialViewport } from '../../../lib/tree-viewport';
import { useTree } from '../../context';
import { usePathSelection } from '../use-path-selection';

export const useTreeFlow = () => {
  const { tree, layout } = useTree();
  const { path, selected, selectTank, onClear } = usePathSelection();
  const store = useStoreApi<TankFlowNode, BranchFlowEdge>();

  const onInit: OnInit<TankFlowNode, BranchFlowEdge> = (instance) => {
    const { width, height } = store.getState();
    const focusId = selected?.vehicle.tankId ?? tree.nodes.find(({ vehicle }) => layout.positions.has(vehicle.tankId))?.vehicle.tankId;
    const focus = focusId === undefined ? null : (layout.positions.get(focusId) ?? null);

    void instance.setViewport(initialViewport({ layout, width, height, focus }));
  };

  const onNodeClick: NodeMouseHandler<TankFlowNode> = (_event, node) => selectTank(node.data.node.vehicle.tankId);

  return { nation: tree.nation, ...toFlowElements({ tree, layout, path }), onInit, onNodeClick, onClear };
};
