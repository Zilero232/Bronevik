'use client';

import { createContext, use } from 'react';

import type { BoardWorkspaceContextValue } from './board-workspace-context.types';

export const BoardWorkspaceContext = createContext<BoardWorkspaceContextValue | null>(null);

export const useWorkspace = () => {
  const context = use(BoardWorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used inside BoardWorkspaceProvider');
  }

  return context;
};
