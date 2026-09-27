import type { TacticBoard } from '@/entities/tactic/board';

import type { useBoardWorkspaceState } from './use-board-workspace-state';

export type BoardWorkspaceInput = {
  board: TacticBoard;
  urlToken: string | null;
};

export type BoardWorkspace = ReturnType<typeof useBoardWorkspaceState>;
