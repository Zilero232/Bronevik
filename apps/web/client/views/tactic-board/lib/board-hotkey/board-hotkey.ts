import type { BoardHotkey, BoardHotkeyEvent } from './board-hotkey.types';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (TYPING_TAGS.has(target.tagName) || target.isContentEditable);

export const boardHotkey = ({ key, ctrlKey, metaKey, shiftKey, target }: BoardHotkeyEvent): BoardHotkey | null => {
  if (isTypingTarget(target)) {
    return null;
  }

  const isMod = ctrlKey || metaKey;
  const lower = key.toLowerCase();

  if (isMod && lower === 'z') {
    return shiftKey ? 'redo' : 'undo';
  }

  if (isMod && lower === 'y') {
    return 'redo';
  }

  if (!isMod && (key === 'Delete' || key === 'Backspace')) {
    return 'delete';
  }

  if (key === 'Escape') {
    return 'escape';
  }

  return null;
};
