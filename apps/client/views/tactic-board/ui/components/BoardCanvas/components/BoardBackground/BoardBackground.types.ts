import type { BoardGrid } from '../../../../../lib/board-grid';
import type { CanvasPalette } from '../../../../../model/board-tools.types';

export type BoardBackgroundProps = {
  grid: BoardGrid;
  palette: CanvasPalette;
  mapName: string | null;
  size: number;
};
