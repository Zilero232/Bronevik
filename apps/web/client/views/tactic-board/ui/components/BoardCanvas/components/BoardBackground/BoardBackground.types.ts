import type { BoardGrid } from '../../../../../lib/board-grid';
import type { CanvasPalette } from '../../../../../lib/canvas-palette';

export type BoardBackgroundProps = {
  grid: BoardGrid;
  palette: CanvasPalette;
  mapName: string | null;
  size: number;
};
