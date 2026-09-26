import type { KonvaEventObject } from 'konva/lib/Node';

import type { TacticIcon, TacticStroke } from '@/shared/api/tactics';

import type { IconAppearance, StrokeGeometry } from '../../../lib/shape-geometry';

export type BoardPointerEvent = KonvaEventObject<MouseEvent | PointerEvent | TouchEvent>;

export type BoardDragEvent = KonvaEventObject<DragEvent>;

export type CanvasItemHandlers = {
  isSelected: boolean;
  onPress: () => void;
  onDragEnd: (event: BoardDragEvent) => void;
};

export type CanvasStroke = CanvasItemHandlers & {
  stroke: TacticStroke;
  geometry: StrokeGeometry;
};

export type CanvasIcon = CanvasItemHandlers & {
  icon: TacticIcon;
  appearance: IconAppearance;
};

export type CanvasLayer = {
  id: string;
  strokes: CanvasStroke[];
  icons: CanvasIcon[];
};
