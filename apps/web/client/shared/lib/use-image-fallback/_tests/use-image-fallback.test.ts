import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useImageFallback } from '../use-image-fallback';

describe('useImageFallback', () => {
  it('walks the sources in order as each one fails', () => {
    const { result } = renderHook(() => useImageFallback([null, 'https://img.test/large.png', 'https://img.test/big.png']));

    expect(result.current.image).toBe('https://img.test/large.png');

    act(() => result.current.onError());

    expect(result.current.image).toBe('https://img.test/big.png');

    act(() => result.current.onError());

    expect(result.current.image).toBeNull();
  });

  it('tries a new source even after an earlier one failed', () => {
    const { result, rerender } = renderHook(({ src }) => useImageFallback([src]), { initialProps: { src: 'https://img.test/a.png' } });

    act(() => result.current.onError());
    rerender({ src: 'https://img.test/b.png' });

    expect(result.current.image).toBe('https://img.test/b.png');
  });
});
