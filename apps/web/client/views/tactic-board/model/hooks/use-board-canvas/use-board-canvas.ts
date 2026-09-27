'use client';

import { useTacticMaps } from '@/features/community/tactic-board-settings';

import type { BoardItemRef } from '../../board.types';
import type { BoardDragEvent, BoardPointerEvent, CanvasLayer, CanvasStroke } from './use-board-canvas.types';

import { BOARD } from '../../../config';
import { fitScale } from '../../../lib/board-geometry';
import { boardGrid } from '../../../lib/board-grid';
import { isItemTool } from '../../../lib/board-tools';
import { iconAppearance, strokeGeometry } from '../../../lib/shape-geometry';
import { useWorkspace } from '../../context';
import { useCanvasPalette } from '../use-canvas-palette';

export const useBoardCanvas = (width: number) => {
  const workspace = useWorkspace();
  const palette = useCanvasPalette();
  const { mapOf } = useTacticMaps();

  const scale = fitScale({ width, size: BOARD.size });
  const pointerOf = (event: BoardPointerEvent) => event.target.getStage()?.getRelativePointerPosition() ?? null;

  const onPointerDown = (event: BoardPointerEvent) => {
    const point = pointerOf(event);

    if (event.target === event.target.getStage()) {
      workspace.onBlankPress();
    }

    if (point) {
      workspace.onPointerDown(point);
    }
  };

  const onPointerMove = (event: BoardPointerEvent) => {
    const point = pointerOf(event);

    if (point) {
      workspace.onPointerMove(point);
    }
  };

  const onStrokeDragEnd = (ref: BoardItemRef) => (event: BoardDragEvent) => {
    const { x, y } = event.target.position();

    event.target.position({ x: 0, y: 0 });
    workspace.onStrokeDragEnd({ ...ref, dx: x, dy: y });
  };

  const onIconDragEnd = (ref: BoardItemRef) => (event: BoardDragEvent) => {
    const { x, y } = event.target.position();

    workspace.onIconDragEnd({ ...ref, x, y });
  };

  const layers: CanvasLayer[] = workspace.visibleLayers.map((layer) => ({
    id: layer.id,
    strokes: layer.strokes.map((stroke) => {
      const ref = { layerId: layer.id, itemId: stroke.id };

      return {
        stroke,
        geometry: strokeGeometry(stroke),
        isSelected: workspace.isSelected(ref),
        onPress: () => workspace.onItemPress(ref),
        onDragEnd: onStrokeDragEnd(ref)
      };
    }),
    icons: layer.icons.map((icon) => {
      const ref = { layerId: layer.id, itemId: icon.id };

      return {
        icon,
        appearance: iconAppearance({ icon, palette }),
        isSelected: workspace.isSelected(ref),
        onPress: () => workspace.onItemPress(ref),
        onDragEnd: onIconDragEnd(ref)
      };
    })
  }));

  const ignore = () => undefined;
  const draft: CanvasStroke | null = workspace.draft
    ? { stroke: workspace.draft, geometry: strokeGeometry(workspace.draft), isSelected: false, onPress: ignore, onDragEnd: ignore }
    : null;

  return {
    scale,
    size: BOARD.size * scale,
    palette,
    grid: boardGrid({ size: BOARD.size, rows: BOARD.gridRows }),
    mapName: mapOf(workspace.board.arenaId)?.name ?? workspace.board.arenaId,
    layers,
    draft,
    peers: workspace.peers,
    isItemListening: isItemTool(workspace.tool),
    canDrag: workspace.isEditable && workspace.tool === 'select',
    onPointerDown,
    onPointerMove,
    onPointerUp: workspace.onPointerUp,
    onPointerLeave: workspace.onPointerLeave
  };
};
