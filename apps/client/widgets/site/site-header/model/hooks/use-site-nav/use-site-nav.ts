'use client';

import { useState } from 'react';

import { SITE_NAV } from '@/shared/constants';
import { usePathname } from '@/shared/i18n/navigation';

import type { SiteNavMenuState } from './use-site-nav.types';

import { activeSiteNav } from '../../../lib/nav-match';

export const useSiteNav = () => {
  const pathname = usePathname();
  const [menu, setMenu] = useState<SiteNavMenuState>({ value: null, pathname });
  const [hovered, setHovered] = useState<string | null>(null);

  const active = activeSiteNav(pathname);
  const isToolsActive = active.href === SITE_NAV.tools.href;
  const value = menu.pathname === pathname ? menu.value : null;

  return {
    ...active,
    isToolsActive,
    value,
    indicatorKey: value ?? hovered ?? active.groupKey ?? (isToolsActive ? SITE_NAV.tools.key : null),
    onValueChange: (next: string | null) => setMenu({ value: next, pathname }),
    onHover: (key: string) => setHovered(key),
    onLeave: () => setHovered(null)
  };
};
