import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCopyFeedback } from '..';

const VALUE = 'https://example.test/share';

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  vi.useFakeTimers();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
});

afterEach(() => {
  vi.useRealTimers();
  writeText.mockReset();
  Reflect.deleteProperty(navigator, 'clipboard');
});

describe('useCopyFeedback', () => {
  it('starts in the not-copied state', () => {
    const { result } = renderHook(() => useCopyFeedback({ value: VALUE }));

    expect(result.current.copied).toBe(false);
  });

  it('writes the value to the clipboard and reports it as copied', async () => {
    const { result } = renderHook(() => useCopyFeedback({ value: VALUE }));

    await act(() => result.current.onCopyClick());

    expect(writeText).toHaveBeenCalledWith(VALUE);
    expect(result.current.copied).toBe(true);
  });

  it('notifies the caller only after the clipboard write finished', async () => {
    const onCopy = vi.fn(() => {
      expect(writeText).toHaveBeenCalledWith(VALUE);
    });

    const { result } = renderHook(() => useCopyFeedback({ value: VALUE, onCopy }));

    await act(() => result.current.onCopyClick());

    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('drops the copied flag again after a moment', async () => {
    const { result } = renderHook(() => useCopyFeedback({ value: VALUE }));

    await act(() => result.current.onCopyClick());

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.copied).toBe(false);
  });
});
