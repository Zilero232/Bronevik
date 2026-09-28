'use client';

import type { FocusEvent } from 'react';

import { useReactFlow, useStoreApi } from '@xyflow/react';

import type { NodePosition } from '../../../lib/tree-layout';

import { TREE_LAYOUT, TREE_VIEW } from '../../../config';
import { isNodeInView } from '../../../lib/tree-viewport';

export const useNodeFocus = (position: NodePosition) => {
  const store = useStoreApi();
  const { setCenter } = useReactFlow();

  return (event: FocusEvent<HTMLElement>) => {
    const {
      transform: [x, y, zoom],
      width,
      height
    } = store.getState();

    if (!event.currentTarget.matches(':focus-visible') || isNodeInView({ position, viewport: { x, y, zoom }, width, height })) {
      return;
    }

    void setCenter(position.x + TREE_LAYOUT.nodeWidth / 2, position.y + TREE_LAYOUT.nodeHeight / 2, { zoom, duration: TREE_VIEW.fitDuration });
  };
};
