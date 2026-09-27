'use client';

import { useWindowEvent } from '@siberiacancode/reactuse';

import { useAuthSession } from '@/entities/auth/session';

import type { BoardWorkspaceInput } from './use-board-workspace-state.types';

import { boardHotkey } from '../../../lib/board-hotkey';
import { useBoardDocument } from '../use-board-document';
import { useBoardEditor } from '../use-board-editor';

export const useBoardWorkspaceState = ({ board, urlToken }: BoardWorkspaceInput) => {
  const { data: session } = useAuthSession();
  const document = useBoardDocument({ board, urlToken, userName: session?.user.name ?? null });
  const editor = useBoardEditor({ document, role: board.role });

  useWindowEvent('keydown', (event) => {
    const hotkey = boardHotkey(event);

    if (!hotkey) {
      return;
    }

    if (hotkey !== 'escape') {
      event.preventDefault();
    }

    if (hotkey === 'escape') {
      editor.onEscape();
    } else if (hotkey === 'delete') {
      editor.onDeleteSelected();
    } else if (editor.isEditable) {
      document[hotkey]();
    }
  });

  return {
    ...editor,
    board,
    status: document.status,
    isSynced: document.isSynced,
    peers: document.peers,
    canUndo: editor.isEditable && document.canUndo,
    canRedo: editor.isEditable && document.canRedo,
    onUndo: document.undo,
    onRedo: document.redo
  };
};
