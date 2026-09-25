'use client';

import { Background, BackgroundVariant, ReactFlow, ViewportPortal } from '@xyflow/react';

import type { TreeFlowProps } from './TreeFlow.types';

import { TREE_VIEW } from '../../../config';
import { toFlowElements } from '../../../lib/tree-flow';
import { TierRuler } from '../TierRuler';
import { TreeControls } from '../TreeControls';
import { EDGE_TYPES, NODE_TYPES } from './TreeFlow.constants';

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
      edgeTypes={EDGE_TYPES}
      elementsSelectable={false}
      fitViewOptions={{ padding: TREE_VIEW.fitPadding, minZoom: TREE_VIEW.fitMinZoom }}
      maxZoom={TREE_VIEW.maxZoom}
      minZoom={TREE_VIEW.minZoom}
      nodes={nodes}
      nodesConnectable={false}
      nodesDraggable={false}
      nodeTypes={NODE_TYPES}
      preventScrolling={false}
      zoomOnScroll={false}
      onPaneClick={() => onSelect(null)}
    >
      <Background className={s.grid} gap={28} size={1.2} variant={BackgroundVariant.Dots} />
      <ViewportPortal>
        <TierRuler height={layout.height} tiers={layout.tiers} />
      </ViewportPortal>
      <TreeControls />
    </ReactFlow>
  );
};
