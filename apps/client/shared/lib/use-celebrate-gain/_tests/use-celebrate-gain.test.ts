import { renderHook, waitFor } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import type { UseCelebrateGainInput } from '..';

import { useCelebrateGain } from '..';
import { CELEBRATE } from '../../celebrate';

vi.hoisted(() => vi.resetModules());

const confetti = vi.hoisted(() => vi.fn());

vi.mock('canvas-confetti', () => ({ default: confetti }));

const KEY = 'player-1-marks';
const STORAGE_KEY = `${CELEBRATE.storagePrefix}${KEY}`;

const stored = () => window.localStorage.getItem(STORAGE_KEY);

afterEach(() => {
  vi.restoreAllMocks();
  confetti.mockClear();
  window.localStorage.removeItem(STORAGE_KEY);
});

afterAll(() => {
  vi.resetModules();
});

describe('useCelebrateGain', () => {
  it('remembers the first value without celebrating it', async () => {
    renderHook(() => useCelebrateGain({ key: KEY, value: 2 }));

    await vi.dynamicImportSettled();

    expect(stored()).toBe('2');
    expect(confetti).not.toHaveBeenCalled();
  });

  it('celebrates when the value grows past the remembered one', async () => {
    window.localStorage.setItem(STORAGE_KEY, '1');

    renderHook(() => useCelebrateGain({ key: KEY, value: 2 }));

    await waitFor(() => expect(confetti).toHaveBeenCalled());
    expect(stored()).toBe('2');
  });

  it('stays quiet when the value holds or drops', async () => {
    window.localStorage.setItem(STORAGE_KEY, '2');

    const { rerender } = renderHook((input: UseCelebrateGainInput) => useCelebrateGain(input), { initialProps: { key: KEY, value: 2 } });

    rerender({ key: KEY, value: 1 });
    await vi.dynamicImportSettled();

    expect(confetti).not.toHaveBeenCalled();
    expect(stored()).toBe('1');
  });

  it('celebrates a gain that happens while mounted', async () => {
    const { rerender } = renderHook((input: UseCelebrateGainInput) => useCelebrateGain(input), { initialProps: { key: KEY, value: 1 } });

    rerender({ key: KEY, value: 3 });

    await waitFor(() => expect(confetti).toHaveBeenCalled());
  });

  it('does nothing without a key or a numeric value', async () => {
    window.localStorage.setItem(STORAGE_KEY, '1');

    renderHook(() => useCelebrateGain({ key: null, value: 5 }));
    renderHook(() => useCelebrateGain({ key: KEY, value: null }));
    await vi.dynamicImportSettled();

    expect(confetti).not.toHaveBeenCalled();
    expect(stored()).toBe('1');
  });

  it('survives storage that refuses access', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    expect(() => renderHook(() => useCelebrateGain({ key: KEY, value: 2 }))).not.toThrow();
  });
});
