import type { CanvasPalette } from '../../../../../config';
import type { BoardGrid } from '../../../../../lib/board-grid';

export type BoardBackgroundProps = {
  grid: BoardGrid;
  palette: CanvasPalette;
  mapName: string | null;
  size: number;
};
