import type { Rect } from '../../hud/geometry.types';
import type { UiPanel } from '../../protocol/protocol.types';

export type Drag = {
  id: string;
  mouseX: number;
  mouseY: number;
  scale: number;
  rect: Rect;
};

export type StartDragInput = {
  id: string;
  mouseX: number;
  mouseY: number;
};

export type NudgeInput = {
  id: string;
  key: string;
};

export type PlacedPanel = {
  panel: UiPanel;
  rect: Rect;
};

export type MoveInput = {
  id: string;
  rect: Rect;
  final: boolean;
};
