import { getHotkeyMatcher } from '@siberiacancode/reactuse';
import { describe, expect, it } from 'vitest';

import { BOARD_HOTKEYS } from '../board-hotkeys.constants';

const press = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init);

const matches = (hotkey: string, init: KeyboardEventInit) => getHotkeyMatcher(hotkey)(press(init));

const anyOf = (hotkeys: string, init: KeyboardEventInit) => hotkeys.split(',').some((hotkey) => matches(hotkey.trim(), init));

describe('BOARD_HOTKEYS', () => {
  it('undoes on ctrl+z and cmd+z', () => {
    expect(anyOf(BOARD_HOTKEYS.undo, { key: 'z', ctrlKey: true })).toBe(true);
    expect(anyOf(BOARD_HOTKEYS.undo, { key: 'z', metaKey: true })).toBe(true);
    expect(anyOf(BOARD_HOTKEYS.undo, { key: 'Z', ctrlKey: true, shiftKey: true })).toBe(false);
  });

  it('redoes on shift+mod+z and mod+y', () => {
    expect(anyOf(BOARD_HOTKEYS.redo, { key: 'Z', ctrlKey: true, shiftKey: true })).toBe(true);
    expect(anyOf(BOARD_HOTKEYS.redo, { key: 'y', metaKey: true })).toBe(true);
  });

  it('deletes on Delete and Backspace without a modifier', () => {
    expect(anyOf(BOARD_HOTKEYS.delete, { key: 'Delete' })).toBe(true);
    expect(anyOf(BOARD_HOTKEYS.delete, { key: 'Backspace' })).toBe(true);
    expect(anyOf(BOARD_HOTKEYS.delete, { key: 'Backspace', ctrlKey: true })).toBe(false);
  });

  it('escapes on Escape and ignores a plain letter', () => {
    expect(anyOf(BOARD_HOTKEYS.escape, { key: 'Escape' })).toBe(true);
    expect(Object.values(BOARD_HOTKEYS).some((hotkeys) => anyOf(hotkeys, { key: 'z' }))).toBe(false);
  });
});
