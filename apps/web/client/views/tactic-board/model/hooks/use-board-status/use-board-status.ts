'use client';

import { useWorkspace } from '../../context';

export const useBoardStatus = () => {
  const { status, isSynced, isEditable, peers, board } = useWorkspace();

  return {
    status: status === 'connected' && !isSynced ? 'connecting' : status,
    isReadOnly: board.role === 'view' || (isSynced && !isEditable),
    peers
  };
};
