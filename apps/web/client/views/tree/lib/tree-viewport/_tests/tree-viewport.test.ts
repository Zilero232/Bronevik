import { describe, expect, it } from 'vitest';

import { TREE_LAYOUT, TREE_VIEW } from '../../../config';
import { initialViewport, isNodeInView } from '../tree-viewport';

const { nodeWidth, nodeHeight, rulerOffset } = TREE_LAYOUT;
const { edgePadding, readableZoom, initialMaxZoom } = TREE_VIEW;

describe('initialViewport', () => {
  it('centres a small tree at no more than the initial max zoom', () => {
    const viewport = initialViewport({ layout: { width: 400, height: 200 }, width: 1200, height: 800, focus: null });

    expect(viewport.zoom).toBe(initialMaxZoom);
    expect(viewport.x).toBe((1200 - 400) / 2);
    expect(viewport.y).toBe((800 - (200 + rulerOffset * 2)) / 2 + rulerOffset);
  });

  it('keeps a large tree readable and anchors it at the top-left edge', () => {
    const viewport = initialViewport({ layout: { width: 3000, height: 2400 }, width: 1200, height: 600, focus: null });

    expect(viewport.zoom).toBe(readableZoom);
    expect(viewport.x).toBe(edgePadding);
    expect(viewport.y).toBe(edgePadding + rulerOffset * readableZoom);
  });

  it('centres the focused node when the tree overflows, without leaving the tree bounds', () => {
    const focus = { x: 1200, y: 1000 };
    const viewport = initialViewport({ layout: { width: 3000, height: 2400 }, width: 1200, height: 600, focus });

    expect(focus.x * viewport.zoom + viewport.x + (nodeWidth / 2) * viewport.zoom).toBeCloseTo(600);
    expect(focus.y * viewport.zoom + viewport.y + (nodeHeight / 2) * viewport.zoom).toBeCloseTo(300);
  });

  it('does not scroll past the first column when the focus sits on the left edge', () => {
    const viewport = initialViewport({ layout: { width: 3000, height: 2400 }, width: 1200, height: 600, focus: { x: 0, y: 0 } });

    expect(viewport.x).toBe(edgePadding);
    expect(viewport.y).toBe(edgePadding + rulerOffset * readableZoom);
  });
});

describe('isNodeInView', () => {
  const viewport = { x: 0, y: 0, zoom: 1 };

  it('detects nodes fully inside the pane', () => {
    expect(isNodeInView({ position: { x: 10, y: 10 }, viewport, width: 800, height: 600 })).toBe(true);
  });

  it('detects nodes outside the pane', () => {
    expect(isNodeInView({ position: { x: 700, y: 10 }, viewport, width: 800, height: 600 })).toBe(false);
    expect(isNodeInView({ position: { x: 10, y: -20 }, viewport, width: 800, height: 600 })).toBe(false);
  });
});
