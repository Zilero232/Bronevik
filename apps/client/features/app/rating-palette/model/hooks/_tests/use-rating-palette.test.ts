import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '@/shared/constants';

import { useRatingPalette } from '../use-rating-palette';
import { useRatingPaletteSync } from '../use-rating-palette-sync';

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.ratingPalette;
});

describe('useRatingPalette', () => {
  it('starts on the default palette', () => {
    const { result } = renderHook(() => useRatingPalette());

    expect(result.current.palette).toBe('default');
    expect(result.current.isXvm).toBe(false);
  });

  it('switches to the XVM scale and remembers it', () => {
    const { result } = renderHook(() => useRatingPalette());

    act(() => result.current.setPalette('xvm'));

    expect(result.current.isXvm).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.ratingPalette)).toContain('xvm');
  });

  it('falls back to the default palette for an unknown stored value', () => {
    localStorage.setItem(STORAGE_KEYS.ratingPalette, JSON.stringify('neon'));

    const { result } = renderHook(() => useRatingPalette());

    expect(result.current.palette).toBe('default');
  });
});

describe('useRatingPaletteSync', () => {
  it('mirrors the chosen palette onto the root element', () => {
    const { result } = renderHook(() => {
      useRatingPaletteSync();

      return useRatingPalette();
    });

    expect(document.documentElement.dataset.ratingPalette).toBe('default');

    act(() => result.current.setPalette('xvm'));

    expect(document.documentElement.dataset.ratingPalette).toBe('xvm');
  });
});
