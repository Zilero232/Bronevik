import { describe, expect, it } from 'vitest';

import type { BoardHotkeyEvent } from '../board-hotkey.types';

import { boardHotkey } from '../board-hotkey';

const press = (patch: Partial<BoardHotkeyEvent>): BoardHotkeyEvent => ({
  key: 'z',
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  target: document.body,
  ...patch
});

describe('boardHotkey', () => {
  it('undoes on ctrl+z and cmd+z', () => {
    expect(boardHotkey(press({ ctrlKey: true }))).toBe('undo');
    expect(boardHotkey(press({ metaKey: true }))).toBe('undo');
  });

  it('redoes on shift+mod+z and mod+y', () => {
    expect(boardHotkey(press({ ctrlKey: true, shiftKey: true, key: 'Z' }))).toBe('redo');
    expect(boardHotkey(press({ ctrlKey: true, key: 'y' }))).toBe('redo');
  });

  it('deletes on Delete and Backspace', () => {
    expect(boardHotkey(press({ key: 'Delete' }))).toBe('delete');
    expect(boardHotkey(press({ key: 'Backspace' }))).toBe('delete');
  });

  it('ignores a plain letter', () => {
    expect(boardHotkey(press({}))).toBeNull();
  });

  it('leaves keys alone while the user types in a field', () => {
    expect(boardHotkey(press({ key: 'Backspace', target: document.createElement('input') }))).toBeNull();
  });
});
