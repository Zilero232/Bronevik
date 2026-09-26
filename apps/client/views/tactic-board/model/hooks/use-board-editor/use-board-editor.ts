'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import type { TacticIcon, TacticIconKind, TacticLayer, TacticStroke } from '@/shared/api/tactics';

import type { BoardTeam, BoardTool } from '../../../config';
import type { BoardPoint } from '../../../lib/board-geometry';
import type { BoardItemRef, IconDragInput, LayerRecipe, RenameLayerRequest, StrokeDragInput } from '../../board.types';
import type { UseBoardEditorInput } from './use-board-editor.types';

import { BOARD_DEFAULTS, BOARD_LIMITS, BOARD_TEAMS } from '../../../config';
import { appendPenPoint, clampPoint, dragShapePoints, isDrawnStroke } from '../../../lib/board-geometry';
import { createBoardId } from '../../../lib/board-id';
import { isDrawTool } from '../../../lib/board-tools';
import {
  addIcon,
  addStroke,
  canAddIcon,
  canAddLayer,
  canAddStroke,
  clearLayer,
  createLayer,
  hasItem,
  moveIcon,
  removeItem,
  renameLayer,
  shiftStroke,
  toggleLayer
} from '../../../lib/layer-ops';

export const useBoardEditor = ({ document, role }: UseBoardEditorInput) => {
  const t = useTranslations('tactics.board');
  const [tool, setTool] = useState<BoardTool>(BOARD_DEFAULTS.tool);
  const [iconKind, setIconKind] = useState<TacticIconKind>(BOARD_DEFAULTS.iconKind);
  const [team, setTeam] = useState<BoardTeam>(BOARD_DEFAULTS.team);
  const [color, setColor] = useState<string>(BOARD_DEFAULTS.color);
  const [width, setWidth] = useState<number>(BOARD_DEFAULTS.width);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [selection, setSelection] = useState<BoardItemRef | null>(null);
  const [draft, setDraft] = useState<TacticStroke | null>(null);
  const [textAnchor, setTextAnchor] = useState<BoardPoint | null>(null);

  const { layers, isSynced, isWritable } = document;
  const isEditable = role !== 'view' && isSynced && isWritable;
  const activeLayer = layers.find(({ id }) => id === activeLayerId) ?? layers[0] ?? null;

  const newLayer = () => createLayer({ id: createBoardId(), name: t('layers.defaultName', { number: layers.length + 1 }) });

  const onActiveLayer = (recipe: LayerRecipe) => {
    if (!isEditable) {
      return;
    }

    if (activeLayer) {
      document.updateLayer({ layerId: activeLayer.id, recipe });

      return;
    }

    const created = recipe(newLayer());

    document.addLayer(created);
    setActiveLayerId(created.id);
  };

  const commitStroke = (stroke: TacticStroke) => {
    if (activeLayer && !canAddStroke(activeLayer)) {
      toast.error(t('limits.strokes', { max: BOARD_LIMITS.strokes }));

      return;
    }

    onActiveLayer((layer) => addStroke({ layer, stroke }));
  };

  const commitIcon = (icon: TacticIcon) => {
    if (activeLayer && !canAddIcon(activeLayer)) {
      toast.error(t('limits.icons', { max: BOARD_LIMITS.icons }));

      return;
    }

    onActiveLayer((layer) => addIcon({ layer, icon }));
  };

  const onPointerDown = (raw: BoardPoint) => {
    const point = clampPoint(raw);

    if (!isEditable) {
      return;
    }

    if (isDrawTool(tool)) {
      setDraft({ id: createBoardId(), tool, color, width, points: tool === 'pen' ? [point.x, point.y] : [point.x, point.y, point.x, point.y] });
    } else if (tool === 'text') {
      setTextAnchor(point);
    } else if (tool === 'icon') {
      commitIcon({ id: createBoardId(), kind: iconKind, team: BOARD_TEAMS.indexOf(team), x: point.x, y: point.y, rotation: 0 });
    }
  };

  const onPointerMove = (point: BoardPoint) => {
    document.setCursor(clampPoint(point));

    if (draft) {
      setDraft({
        ...draft,
        points: draft.tool === 'pen' ? [...appendPenPoint({ points: draft.points, point })] : dragShapePoints({ points: draft.points, point })
      });
    }
  };

  const onPointerUp = () => {
    if (draft && isDrawnStroke(draft)) {
      commitStroke(draft);
    }

    setDraft(null);
  };

  const onPointerLeave = () => document.setCursor(null);

  const onBlankPress = () => {
    if (tool === 'select') {
      setSelection(null);
    }
  };

  const onItemPress = (ref: BoardItemRef) => {
    if (tool === 'eraser' && isEditable) {
      document.updateLayer({ layerId: ref.layerId, recipe: (layer) => removeItem({ layer, itemId: ref.itemId }) });
    } else if (tool === 'select') {
      setSelection(ref);
    }
  };

  const onStrokeDragEnd = ({ layerId, itemId, dx, dy }: StrokeDragInput) =>
    document.updateLayer({ layerId, recipe: (layer) => shiftStroke({ layer, itemId, dx, dy }) });

  const onIconDragEnd = ({ layerId, itemId, x, y }: IconDragInput) =>
    document.updateLayer({ layerId, recipe: (layer) => moveIcon({ layer, itemId, x, y }) });

  const onTextSubmit = (text: string) => {
    const value = text.trim().slice(0, BOARD_LIMITS.text);

    if (textAnchor && value.length > 0) {
      commitStroke({ id: createBoardId(), tool: 'text', color, width, points: [textAnchor.x, textAnchor.y], text: value });
    }

    setTextAnchor(null);
  };

  const onTextCancel = () => setTextAnchor(null);

  const onToolChange = (next: BoardTool) => {
    setTool(next);
    setSelection(null);
    setTextAnchor(null);
  };

  const onIconKindChange = (next: TacticIconKind) => {
    setIconKind(next);
    setTool('icon');
  };

  const onDeleteSelected = () => {
    if (selection && isEditable) {
      document.updateLayer({ layerId: selection.layerId, recipe: (layer) => removeItem({ layer, itemId: selection.itemId }) });
      setSelection(null);
    }
  };

  const onClearLayer = () => {
    if (activeLayer && isEditable) {
      document.updateLayer({ layerId: activeLayer.id, recipe: clearLayer });
      setSelection(null);
    }
  };

  const onAddLayer = () => {
    if (!isEditable) {
      return;
    }

    if (!canAddLayer(layers)) {
      toast.error(t('limits.layers', { max: BOARD_LIMITS.layers }));

      return;
    }

    const layer = newLayer();

    document.addLayer(layer);
    setActiveLayerId(layer.id);
  };

  const onRemoveLayer = (layerId: string) => {
    if (isEditable) {
      document.removeLayer(layerId);
      setSelection(null);
    }
  };

  const onRenameLayer = ({ layerId, name }: RenameLayerRequest) => {
    if (isEditable && name.trim().length > 0) {
      document.updateLayer({ layerId, recipe: (layer) => renameLayer({ layer, name }) });
    }
  };

  const onToggleLayer = (layerId: string) => {
    if (isEditable) {
      document.updateLayer({ layerId, recipe: toggleLayer });
    }
  };

  const onEscape = () => {
    setSelection(null);
    setDraft(null);
    setTextAnchor(null);
  };

  const isSelected = (ref: BoardItemRef) => selection?.layerId === ref.layerId && selection.itemId === ref.itemId;

  const visibleLayers: TacticLayer[] = layers.filter(({ visible }) => visible);
  const hasSelection = selection !== null && layers.some((layer) => layer.id === selection.layerId && hasItem({ layer, itemId: selection.itemId }));

  return {
    layers,
    visibleLayers,
    activeLayer,
    isEditable,
    tool,
    iconKind,
    team,
    color,
    width,
    draft,
    textAnchor,
    hasSelection,
    isSelected,
    onToolChange,
    onIconKindChange,
    onTeamChange: setTeam,
    onColorChange: setColor,
    onWidthChange: setWidth,
    onSelectLayer: setActiveLayerId,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
    onBlankPress,
    onItemPress,
    onStrokeDragEnd,
    onIconDragEnd,
    onTextSubmit,
    onTextCancel,
    onDeleteSelected,
    onClearLayer,
    onAddLayer,
    onRemoveLayer,
    onRenameLayer,
    onToggleLayer,
    onEscape
  };
};
