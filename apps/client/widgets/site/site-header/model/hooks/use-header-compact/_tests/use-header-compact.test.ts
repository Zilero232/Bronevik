import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { NAV_MENU } from '../../../../config';
import { useHeaderCompact } from '../use-header-compact';

const scrollTo = (y: number) => {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    Object.defineProperty(window, 'pageYOffset', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
  });
};

afterEach(() => {
  Reflect.deleteProperty(window, 'scrollY');
  Reflect.deleteProperty(window, 'pageYOffset');
});

describe('useHeaderCompact', () => {
  it('starts expanded at the top of the page', () => {
    const { result } = renderHook(() => useHeaderCompact());

    expect(result.current).toBe(false);
  });

  it('stays expanded until the page scrolls past the compact threshold', () => {
    const { result } = renderHook(() => useHeaderCompact());

    scrollTo(NAV_MENU.compactAbove);
    expect(result.current).toBe(false);

    scrollTo(NAV_MENU.compactAbove + 1);
    expect(result.current).toBe(true);
  });

  it('stays compact while scrolling back through the band between the thresholds', () => {
    const { result } = renderHook(() => useHeaderCompact());

    scrollTo(NAV_MENU.compactAbove + 1);
    scrollTo(NAV_MENU.expandBelow + 1);

    expect(result.current).toBe(true);
  });

  it('expands again once scrolled back near the top', () => {
    const { result } = renderHook(() => useHeaderCompact());

    scrollTo(NAV_MENU.compactAbove + 1);
    scrollTo(NAV_MENU.expandBelow);

    expect(result.current).toBe(false);
  });
});
