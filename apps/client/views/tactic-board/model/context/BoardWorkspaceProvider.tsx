'use client';

import type { BoardWorkspaceProviderProps } from './board-workspace-context.types';

import { useBoardWorkspace } from '../hooks/use-board-workspace';
import { BoardWorkspaceContext } from './board-workspace-context';

export const BoardWorkspaceProvider = ({ board, urlToken, children }: BoardWorkspaceProviderProps) => {
  const workspace = useBoardWorkspace({ board, urlToken });

  return <BoardWorkspaceContext value={workspace}>{children}</BoardWorkspaceContext>;
};
