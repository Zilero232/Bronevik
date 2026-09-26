import type { CanvasStroke } from '../../../../../model/hooks';

export type StrokeShapeProps = {
  item: CanvasStroke;
  selectionColor: string;
  isListening: boolean;
  draggable?: boolean;
};
