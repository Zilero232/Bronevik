import type { TacticBoard } from '@/entities/tactic/board';

export type UseUpdateBoardInput = {
  board: TacticBoard;
  token: string | null;
};
