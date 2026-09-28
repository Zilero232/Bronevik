'use client';

import { ReactFlow, ViewportPortal } from '@xyflow/react';

import { TREE_VIEW } from '../../../config';
import { useTreeFlow } from '../../../model/hooks';
import { BranchEdge } from '../BranchEdge';
import { TankNode } from '../TankNode';
import { TierRuler } from '../TierRuler';
import { TreeControls } from '../TreeControls';

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
      edgeTypes={{ branch: BranchEdge }}
      elementsSelectable={false}
      maxZoom={TREE_VIEW.maxZoom}
      minZoom={TREE_VIEW.minZoom}
      nodes={nodes}
      nodesConnectable={false}
      nodesDraggable={false}
      nodesFocusable={false}
      nodeTypes={{ tank: TankNode }}
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
