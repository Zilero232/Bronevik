import type { TacticBoard } from '@/entities/tactic/board';

import type { useBoardWorkspace } from './use-board-workspace';

export type BoardWorkspaceInput = {
  board: TacticBoard;
  urlToken: string | null;
};

export type BoardWorkspace = ReturnType<typeof useBoardWorkspace>;
