import type { Viewport } from '@xyflow/react';

import { clamp } from 'remeda';

import type { InitialViewportInput, NodeInViewInput, PlaceAxisInput } from './tree-viewport.types';

import { TREE_LAYOUT, TREE_VIEW } from '../../config';

const { nodeWidth, nodeHeight, rulerOffset } = TREE_LAYOUT;

const placeAxis = ({ view, content, start, focus }: PlaceAxisInput) => {
  const edge = TREE_VIEW.edgePadding;

  if (content + edge * 2 <= view) {
    return (view - content) / 2 - start;
  }

  const anchored = edge - start;

  if (focus === null) {
    return anchored;
  }

  return clamp(view / 2 - focus, { min: view - edge - content - start, max: anchored });
};

export const initialViewport = ({ layout, width, height, focus }: InitialViewportInput): Viewport => {
  const contentWidth = layout.width;
  const contentHeight = layout.height + rulerOffset * 2;
  const edge = TREE_VIEW.edgePadding * 2;
  const fitZoom = Math.min((width - edge) / contentWidth, (height - edge) / contentHeight);
  const zoom = clamp(fitZoom, { min: TREE_VIEW.readableZoom, max: TREE_VIEW.initialMaxZoom });

  return {
    zoom,
    x: placeAxis({ view: width, content: contentWidth * zoom, start: 0, focus: focus === null ? null : (focus.x + nodeWidth / 2) * zoom }),
    y: placeAxis({
      view: height,
      content: contentHeight * zoom,
      start: -rulerOffset * zoom,
      focus: focus === null ? null : (focus.y + nodeHeight / 2) * zoom
    })
  };
};

export const isNodeInView = ({ position, viewport: { x, y, zoom }, width, height }: NodeInViewInput) => {
  const left = position.x * zoom + x;
  const top = position.y * zoom + y;

  return left >= 0 && top >= 0 && left + nodeWidth * zoom <= width && top + nodeHeight * zoom <= height;
};
