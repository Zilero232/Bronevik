import { sumBy } from 'remeda';

import type { TacticBoardData } from '@/entities/tactic/board';

import type { BoardSummary } from './board-summary.types';

export const boardSummary = ({ layers }: TacticBoardData): BoardSummary => ({
  layers: layers.length,
  strokes: sumBy(layers, ({ strokes }) => strokes.length),
  icons: sumBy(layers, ({ icons }) => icons.length)
});
