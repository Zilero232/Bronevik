import type { TacticIcon } from '@/entities/tactic/board';

import type { BoardBox, BoardCircle, BoardPoint } from '../board-geometry';
import type { CanvasPalette } from '../canvas-palette';
import type { IconGlyph } from '../icon-glyph';

export type StrokeGeometry = {
  anchor: BoardPoint;
  box: BoardBox;
  circle: BoardCircle;
  pointer: number;
  fontSize: number;
};

export type IconAppearanceInput = {
  icon: TacticIcon;
  palette: CanvasPalette;
};

export type IconAppearance = {
  glyph: IconGlyph;
  fill: string | undefined;
  stroke: string;
  labelOffset: number;
};
