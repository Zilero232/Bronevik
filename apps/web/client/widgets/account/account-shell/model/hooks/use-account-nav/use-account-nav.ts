'use client';

import { useEffect, useRef } from 'react';

import { useSignOut } from '@/entities/auth/session';
import { usePathname } from '@/shared/i18n/navigation';

import { isActiveTab } from '../../../lib/active-tab';

export const useAccountNav = () => {
  const pathname = usePathname();
  const signOut = useSignOut();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');

    if (nav && active && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2 });
    }
  }, [pathname]);

  return {
    navRef,
    isActive: (href: string) => isActiveTab({ href, pathname }),
    isSigningOut: signOut.isPending,
    onSignOut: () => signOut.mutate()
  };
};
