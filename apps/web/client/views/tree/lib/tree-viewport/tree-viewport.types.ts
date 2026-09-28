import type { Viewport } from '@xyflow/react';

import type { NodePosition, TreeLayout } from '../tree-layout';

export type InitialViewportInput = {
  layout: Pick<TreeLayout, 'height' | 'width'>;
  width: number;
  height: number;
  focus: NodePosition | null;
};

export type NodeInViewInput = {
  position: NodePosition;
  viewport: Viewport;
  width: number;
  height: number;
};

export type PlaceAxisInput = {
  view: number;
  content: number;
  start: number;
  focus: number | null;
};
