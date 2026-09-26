import type { ReactNode } from 'react';

import type { BoardWorkspace, BoardWorkspaceInput } from '../hooks/use-board-workspace';

export type BoardWorkspaceContextValue = BoardWorkspace;

export type BoardWorkspaceProviderProps = BoardWorkspaceInput & {
  children: ReactNode;
};
