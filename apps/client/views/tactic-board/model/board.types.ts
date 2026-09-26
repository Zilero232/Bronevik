import type { TacticLayer } from '@/entities/tactic/board';

export type BoardConnection = 'connected' | 'connecting' | 'denied' | 'disconnected';

export type BoardItemRef = {
  layerId: string;
  itemId: string;
};

export type LayerRecipe = (layer: TacticLayer) => TacticLayer;

export type UpdateLayerInput = {
  layerId: string;
  recipe: LayerRecipe;
};

export type StrokeDragInput = BoardItemRef & {
  dx: number;
  dy: number;
};

export type IconDragInput = BoardItemRef & {
  x: number;
  y: number;
};

export type RenameLayerRequest = {
  layerId: string;
  name: string;
};
