'use client';

import { target, useActiveElement, useHotkeys } from '@siberiacancode/reactuse';

import { useAuthSession } from '@/entities/auth/session';
import { isTypingTarget } from '@/shared/lib';

import type { BoardWorkspaceInput } from './use-board-workspace-state.types';

import { BOARD_HOTKEYS } from '../../../config';
import { useBoardDocument } from '../use-board-document';
import { useBoardEditor } from '../use-board-editor';

export const useBoardWorkspaceState = ({ board, urlToken }: BoardWorkspaceInput) => {
  const { data: session } = useAuthSession();
  const document = useBoardDocument({ board, urlToken, userName: session?.user.name ?? null });
  const editor = useBoardEditor({ document, role: board.role });

  const { value: focused } = useActiveElement(target(() => window.document.body));

  const keys = target(() => window);
  const options = { enabled: !isTypingTarget(focused) };
  const onHistory = (step: 'redo' | 'undo') => () => editor.isEditable && document[step]();

  useHotkeys(keys, BOARD_HOTKEYS.undo, onHistory('undo'), options);
  useHotkeys(keys, BOARD_HOTKEYS.redo, onHistory('redo'), options);
  useHotkeys(keys, BOARD_HOTKEYS.delete, editor.onDeleteSelected, options);
  useHotkeys(keys, BOARD_HOTKEYS.escape, editor.onEscape, options);

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
