import type { Rect, StageBox } from '../../lib/geometry';
import type { UiPanel } from '../../protocol';

export type LiveRect = {
  id: string;
  rect: Rect;
};

export type Drag = LiveRect & {
  mouseX: number;
  mouseY: number;
  scale: number;
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
  box: StageBox;
};

export type MoveInput = LiveRect & {
  final: boolean;
};
