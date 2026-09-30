'use client';

import { useState } from 'react';

import { usePathname } from '@/shared/i18n/navigation';

import type { SiteNavMenuState } from './use-site-nav.types';

import { activeSiteNav } from '../../../lib/nav-match';

export const useSiteNav = () => {
  const pathname = usePathname();
  const [menu, setMenu] = useState<SiteNavMenuState>({ value: null, pathname });
  const [hovered, setHovered] = useState<string | null>(null);

  const active = activeSiteNav(pathname);
  const value = menu.pathname === pathname ? menu.value : null;

  return {
    ...active,
    value,
    indicatorKey: value ?? hovered ?? active.entryKey,
    onValueChange: (next: string | null) => setMenu({ value: next, pathname }),
    onHover: (key: string) => setHovered(key),
    onLeave: () => setHovered(null)
  };
};
