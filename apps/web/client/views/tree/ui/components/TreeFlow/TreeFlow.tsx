'use client';

import { ReactFlow, ViewportPortal } from '@xyflow/react';

import { TREE_VIEW } from '../../../config';
import { useTreeFlow } from '../../../model/hooks';
import { TierRuler } from '../TierRuler';
import { TreeControls } from '../TreeControls';
import { TREE_FLOW_TYPES } from './TreeFlow.constants';

import s from './TreeFlow.module.scss';

import '@xyflow/react/dist/base.css';

export const TreeFlow = () => {
  const { nation, nodes, edges, onInit, onNodeClick, onClear } = useTreeFlow();

  return (
    <ReactFlow
      key={nation}
      className={s.root}
      edges={edges}
      edgesFocusable={false}
      edgeTypes={TREE_FLOW_TYPES.edges}
      elementsSelectable={false}
      maxZoom={TREE_VIEW.maxZoom}
      minZoom={TREE_VIEW.minZoom}
      nodes={nodes}
      nodesConnectable={false}
      nodesDraggable={false}
      nodesFocusable={false}
      nodeTypes={TREE_FLOW_TYPES.nodes}
      preventScrolling={false}
      zoomOnScroll={false}
      onInit={onInit}
      onNodeClick={onNodeClick}
      onPaneClick={onClear}
    >
      <ViewportPortal>
        <TierRuler />
      </ViewportPortal>
      <TreeControls />
    </ReactFlow>
  );
};
