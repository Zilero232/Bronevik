import type { TacticBoard } from '@/entities/tactic/board';

export type SharePanelProps = {
  board: TacticBoard;
  token: string | null;
};
