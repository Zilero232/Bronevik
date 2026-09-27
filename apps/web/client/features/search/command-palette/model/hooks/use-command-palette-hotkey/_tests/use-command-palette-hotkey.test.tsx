import { fireEvent, render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCommandPaletteHotkey } from '../use-command-palette-hotkey';

describe('useCommandPaletteHotkey', () => {
  it('toggles on Ctrl+K and Cmd+K', () => {
    const onToggle = vi.fn();

    renderHook(() => useCommandPaletteHotkey(onToggle));

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'k', metaKey: true });

    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it('toggles on a bare slash', () => {
    const onToggle = vi.fn();

    renderHook(() => useCommandPaletteHotkey(onToggle));

    fireEvent.keyDown(window, { key: '/' });

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('lets a slash through while the user is typing', () => {
    const onToggle = vi.fn();
    const { getByRole } = render(<input aria-label='field' />);

    renderHook(() => useCommandPaletteHotkey(onToggle));

    fireEvent.keyDown(getByRole('textbox'), { key: '/' });

    expect(onToggle).not.toHaveBeenCalled();
  });

  it('ignores a plain K', () => {
    const onToggle = vi.fn();

    renderHook(() => useCommandPaletteHotkey(onToggle));

    fireEvent.keyDown(window, { key: 'k' });

    expect(onToggle).not.toHaveBeenCalled();
  });
});
