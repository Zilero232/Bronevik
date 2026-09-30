import { act, renderHook } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { ROUTES, SITE_NAV_GROUPS } from '@/shared/constants';

import { useSiteNav } from '../use-site-nav';

vi.hoisted(() => vi.resetModules());

const location = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('@/shared/i18n/navigation', () => ({ usePathname: () => location.pathname, useRouter: vi.fn(), Link: vi.fn() }));

const PLAYERS = SITE_NAV_GROUPS.find(({ key }) => key === 'players')!;
const VEHICLES = SITE_NAV_GROUPS.find(({ key }) => key === 'vehicles')!;

const visit = (pathname: string) => {
  location.pathname = pathname;
};

afterEach(() => {
  visit('/');
});

afterAll(() => {
  vi.resetModules();
});

describe('useSiteNav', () => {
  it('highlights the group of the current page', () => {
    visit(ROUTES.tanks.list);

    const { result } = renderHook(() => useSiteNav());

    expect(result.current.entryKey).toBe(VEHICLES.key);
    expect(result.current.href).toBe(ROUTES.tanks.list);
    expect(result.current.indicatorKey).toBe(VEHICLES.key);
  });

  it('points the indicator at a direct link on its page', () => {
    visit(ROUTES.marks);

    const { result } = renderHook(() => useSiteNav());

    expect(result.current.entryKey).toBe('marks');
    expect(result.current.indicatorKey).toBe('marks');
  });

  it('has no indicator on a page outside the navigation', () => {
    visit('/nowhere-in-the-menu');

    const { result } = renderHook(() => useSiteNav());

    expect(result.current.entryKey).toBeNull();
    expect(result.current.indicatorKey).toBeNull();
  });

  it('lets a hovered group take the indicator until the pointer leaves', () => {
    visit(ROUTES.tanks.list);

    const { result } = renderHook(() => useSiteNav());

    act(() => result.current.onHover(PLAYERS.key));
    expect(result.current.indicatorKey).toBe(PLAYERS.key);

    act(() => result.current.onLeave());
    expect(result.current.indicatorKey).toBe(VEHICLES.key);
  });

  it('prefers the open menu over a hovered group', () => {
    const { result } = renderHook(() => useSiteNav());

    act(() => result.current.onHover(PLAYERS.key));
    act(() => result.current.onValueChange(VEHICLES.key));

    expect(result.current.value).toBe(VEHICLES.key);
    expect(result.current.indicatorKey).toBe(VEHICLES.key);
  });

  it('closes the open menu after navigating to another page', () => {
    const { result, rerender } = renderHook(() => useSiteNav());

    act(() => result.current.onValueChange(VEHICLES.key));
    visit(ROUTES.players.list);
    rerender();

    expect(result.current.value).toBeNull();
    expect(result.current.indicatorKey).toBe(PLAYERS.key);
  });
});
