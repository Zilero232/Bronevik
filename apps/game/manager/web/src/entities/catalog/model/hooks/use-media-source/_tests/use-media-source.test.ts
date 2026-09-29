import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMediaSource } from '../use-media-source';

describe('useMediaSource', () => {
  it('drops a source that failed and retries a new one', () => {
    const initialProps: { src: string | null } = { src: 'asset://a.png' };
    const { result, rerender } = renderHook(({ src }) => useMediaSource(src), { initialProps });

    act(() => result.current.onError());

    expect(result.current.src).toBeNull();

    rerender({ src: 'asset://b.png' });

    expect(result.current.src).toBe('asset://b.png');
    expect(result.current.isLoaded).toBe(false);
  });

  it('reports the source as loaded once the element says so', () => {
    const { result } = renderHook(() => useMediaSource('asset://a.png'));

    act(() => result.current.onLoad());

    expect(result.current.isLoaded).toBe(true);
  });

  it('has nothing to show without a source', () => {
    const { result } = renderHook(() => useMediaSource(null));

    expect(result.current).toMatchObject({ src: null, isLoaded: false });
  });
});
