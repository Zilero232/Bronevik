import type { TacticBoardData } from '@/shared/api/tactics';

import type { BoardSummary } from './board-summary.types';

export const boardSummary = ({ layers }: TacticBoardData): BoardSummary => ({
  layers: layers.length,
  strokes: layers.reduce((total, layer) => total + layer.strokes.length, 0),
  icons: layers.reduce((total, layer) => total + layer.icons.length, 0)
});
