'use client';

import { ReactFlow, ViewportPortal } from '@xyflow/react';

import { TREE_FLOW_TYPES, TREE_VIEW } from '../../../config';
import { useTreeFlow } from '../../../model/hooks';
import { TierRuler } from '../TierRuler';
import { TreeControls } from '../TreeControls';

import s from './TreeFlow.module.scss';

import '@xyflow/react/dist/base.css';

export const TreeFlow = () => {
  const { nation, nodes, edges, onClear } = useTreeFlow();

  return (
    <ReactFlow
      fitView
      key={nation}
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
      onPaneClick={onClear}
    >
      <ViewportPortal>
        <TierRuler />
      </ViewportPortal>
      <TreeControls />
    </ReactFlow>
  );
};
