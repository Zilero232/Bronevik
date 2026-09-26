import type { TacticBoard } from '@/shared/api/tactics';

export type UseUpdateBoardInput = {
  board: TacticBoard;
  token: string | null;
};
