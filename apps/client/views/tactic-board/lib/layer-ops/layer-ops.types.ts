import type { TacticIcon, TacticLayer, TacticStroke } from '@/shared/api/tactics';

export type CreateLayerInput = {
  id: string;
  name: string;
};

export type AddStrokeInput = {
  layer: TacticLayer;
  stroke: TacticStroke;
};

export type AddIconInput = {
  layer: TacticLayer;
  icon: TacticIcon;
};

export type LayerItemInput = {
  layer: TacticLayer;
  itemId: string;
};

export type StrokeShiftInput = LayerItemInput & {
  dx: number;
  dy: number;
};

export type IconMoveInput = LayerItemInput & {
  x: number;
  y: number;
};

export type RenameLayerInput = {
  layer: TacticLayer;
  name: string;
};
