export type BoardHotkey = 'delete' | 'escape' | 'redo' | 'undo';

export type BoardHotkeyEvent = Pick<KeyboardEvent, 'ctrlKey' | 'key' | 'metaKey' | 'shiftKey' | 'target'>;
