import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import * as authApi from '@/entities/auth/session/api/auth/auth';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { useAccountNav } from '../use-account-nav';

vi.hoisted(() => vi.resetModules());

const location = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('@/shared/i18n/navigation', () => ({ usePathname: () => location.pathname, useRouter: vi.fn(), Link: vi.fn() }));

const createClient = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

const renderNav = (client = createClient()) => {
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return renderHook(() => useAccountNav(), { wrapper });
};

afterEach(() => {
  location.pathname = '/';
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.resetModules();
});

describe('useAccountNav', () => {
  it('marks the overview tab active only on the overview itself', () => {
    location.pathname = ROUTES.account.overview;

    const { result } = renderNav();

    expect(result.current.isActive(ROUTES.account.overview)).toBe(true);
  });

  it('keeps a section tab active on its nested pages but not the overview tab', () => {
    const section = Object.values(ROUTES.account).find((route) => typeof route === 'string' && route !== ROUTES.account.overview);

    if (typeof section !== 'string') {
      throw new TypeError('no account section route');
    }

    location.pathname = `${section}/nested`;

    const { result } = renderNav();

    expect(result.current.isActive(section)).toBe(true);
    expect(result.current.isActive(ROUTES.account.overview)).toBe(false);
  });

  it('shows signing out in progress and clears the session when done', async () => {
    const pending: { finish: () => void } = { finish: () => undefined };

    vi.spyOn(authApi, 'signOut').mockReturnValue(
      new Promise<void>((resolve) => {
        pending.finish = resolve;
      })
    );

    const client = createClient();

    client.setQueryData(QUERY_KEYS.auth.session, { user: { id: 'user-1', name: 'Grom' }, lestaAccountId: null });

    const { result } = renderNav(client);

    act(() => result.current.onSignOut());
    await waitFor(() => expect(result.current.isSigningOut).toBe(true));

    await act(async () => pending.finish());

    await waitFor(() => expect(result.current.isSigningOut).toBe(false));
    expect(client.getQueryData(QUERY_KEYS.auth.session)).toBeNull();
  });

  describe('scrolling the active tab into view', () => {
    const navWith = ({ scrollWidth, clientWidth }: { scrollWidth: number; clientWidth: number }) => {
      const nav = document.createElement('nav');
      const active = document.createElement('a');

      active.setAttribute('aria-current', 'page');
      nav.append(active);
      Object.defineProperties(nav, { scrollWidth: { value: scrollWidth }, clientWidth: { value: clientWidth } });
      Object.defineProperties(active, { offsetLeft: { value: 500 }, offsetWidth: { value: 100 } });
      nav.scrollTo = vi.fn();

      return nav;
    };

    const navigate = (nav: HTMLElement) => {
      location.pathname = ROUTES.account.overview;

      const hook = renderNav();

      hook.result.current.navRef.current = nav;
      location.pathname = ROUTES.account.billing;
      hook.rerender();
    };

    it('centres the active tab when the tabs overflow', () => {
      const nav = navWith({ scrollWidth: 1_000, clientWidth: 300 });

      navigate(nav);

      expect(nav.scrollTo).toHaveBeenCalledWith({ left: 500 - (300 - 100) / 2 });
    });

    it('leaves the tabs alone when they fit', () => {
      const nav = navWith({ scrollWidth: 300, clientWidth: 300 });

      navigate(nav);

      expect(nav.scrollTo).not.toHaveBeenCalled();
    });
  });
});
