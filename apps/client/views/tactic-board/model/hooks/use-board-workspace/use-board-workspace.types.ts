import type { TacticBoard } from '@/shared/api/tactics';

import type { useBoardWorkspace } from './use-board-workspace';

export type BoardWorkspaceInput = {
  board: TacticBoard;
  urlToken: string | null;
};

export type BoardWorkspace = ReturnType<typeof useBoardWorkspace>;
