'use client';

import type { BoardWorkspaceProviderProps } from './BoardWorkspaceProvider.types';

import { BoardWorkspaceContext } from '../../../model/context';
import { useBoardWorkspaceState } from '../../../model/hooks';

export const BoardWorkspaceProvider = ({ board, urlToken, children }: BoardWorkspaceProviderProps) => {
  const value = useBoardWorkspaceState({ board, urlToken });

  return <BoardWorkspaceContext value={value}>{children}</BoardWorkspaceContext>;
};
