'use client';

import { ReactFlow, ViewportPortal } from '@xyflow/react';

import { TREE_FLOW_TYPES, TREE_VIEW } from '../../../config';
import { toFlowElements } from '../../../lib/tree-flow';
import { useTree } from '../../../model/context';
import { usePathSelection } from '../../../model/hooks';
import { TierRuler } from '../TierRuler';
import { TreeControls } from '../TreeControls';

import s from './TreeFlow.module.scss';

import '@xyflow/react/dist/base.css';

export const TreeFlow = () => {
  const { tree, layout } = useTree();
  const { path, onClear } = usePathSelection();

  const { nodes, edges } = toFlowElements({ tree, layout, path });

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
      onPaneClick={onClear}
    >
      <ViewportPortal>
        <TierRuler height={layout.height} tiers={layout.tiers} />
      </ViewportPortal>
      <TreeControls />
    </ReactFlow>
  );
};
