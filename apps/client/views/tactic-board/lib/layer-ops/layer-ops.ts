import type { TacticLayer } from '@/entities/tactic/board';

import type {
  AddIconInput,
  AddStrokeInput,
  CreateLayerInput,
  IconMoveInput,
  LayerItemInput,
  RenameLayerInput,
  StrokeShiftInput
} from './layer-ops.types';

import { BOARD_LIMITS } from '../../config';
import { clampPoint, translatePoints } from '../board-geometry';

export const createLayer = ({ id, name }: CreateLayerInput): TacticLayer => ({
  id,
  name: name.slice(0, BOARD_LIMITS.layerName),
  visible: true,
  strokes: [],
  icons: []
});

export const addStroke = ({ layer, stroke }: AddStrokeInput): TacticLayer => ({ ...layer, strokes: [...layer.strokes, stroke] });

export const addIcon = ({ layer, icon }: AddIconInput): TacticLayer => ({ ...layer, icons: [...layer.icons, icon] });

export const hasItem = ({ layer, itemId }: LayerItemInput): boolean =>
  layer.strokes.some(({ id }) => id === itemId) || layer.icons.some(({ id }) => id === itemId);

export const removeItem = ({ layer, itemId }: LayerItemInput): TacticLayer => ({
  ...layer,
  strokes: layer.strokes.filter(({ id }) => id !== itemId),
  icons: layer.icons.filter(({ id }) => id !== itemId)
});

export const shiftStroke = ({ layer, itemId, dx, dy }: StrokeShiftInput): TacticLayer => ({
  ...layer,
  strokes: layer.strokes.map((stroke) => (stroke.id === itemId ? { ...stroke, points: translatePoints({ points: stroke.points, dx, dy }) } : stroke))
});

export const moveIcon = ({ layer, itemId, x, y }: IconMoveInput): TacticLayer => ({
  ...layer,
  icons: layer.icons.map((icon) => (icon.id === itemId ? { ...icon, ...clampPoint({ x, y }) } : icon))
});

export const clearLayer = (layer: TacticLayer): TacticLayer => ({ ...layer, strokes: [], icons: [] });

export const renameLayer = ({ layer, name }: RenameLayerInput): TacticLayer => ({
  ...layer,
  name: name.trim().slice(0, BOARD_LIMITS.layerName)
});

export const toggleLayer = (layer: TacticLayer): TacticLayer => ({ ...layer, visible: !layer.visible });

export const canAddLayer = (layers: readonly TacticLayer[]): boolean => layers.length < BOARD_LIMITS.layers;

export const canAddStroke = (layer: TacticLayer): boolean => layer.strokes.length < BOARD_LIMITS.strokes;

export const canAddIcon = (layer: TacticLayer): boolean => layer.icons.length < BOARD_LIMITS.icons;
