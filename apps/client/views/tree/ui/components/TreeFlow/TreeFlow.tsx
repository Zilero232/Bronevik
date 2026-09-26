'use client';

import { ReactFlow, ViewportPortal } from '@xyflow/react';

import type { TreeFlowProps } from './TreeFlow.types';

import { TREE_FLOW_TYPES, TREE_VIEW } from '../../../config';
import { toFlowElements } from '../../../lib/tree-flow';
import { TierRuler } from '../TierRuler';
import { TreeControls } from '../TreeControls';

import s from './TreeFlow.module.scss';

import '@xyflow/react/dist/base.css';

export const TreeFlow = ({ tree, layout, path, onSelect }: TreeFlowProps) => {
  const { nodes, edges } = toFlowElements({ tree, layout, path, onSelect });

  return (
    <ReactFlow
      fitView
      key={tree.nation}
      className={s.root}
      edges={edges}
      edgeTypes={TREE_FLOW_TYPES.edges}
      elementsSelectable={false}
      fitViewOptions={{ padding: TREE_VIEW.fitPadding, minZoom: TREE_VIEW.fitMinZoom }}
      maxZoom={TREE_VIEW.maxZoom}
      minZoom={TREE_VIEW.minZoom}
      nodes={nodes}
      nodesConnectable={false}
      nodesDraggable={false}
      nodeTypes={TREE_FLOW_TYPES.nodes}
      preventScrolling={false}
      zoomOnScroll={false}
      onPaneClick={() => onSelect(null)}
    >
      <ViewportPortal>
        <TierRuler height={layout.height} tiers={layout.tiers} />
      </ViewportPortal>
      <TreeControls />
    </ReactFlow>
  );
};
