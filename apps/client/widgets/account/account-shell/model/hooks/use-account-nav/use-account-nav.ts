'use client';

import { useSignOut } from '@/entities/auth/session';
import { usePathname } from '@/shared/i18n/navigation';

import { isActiveTab } from '../../../lib/active-tab';

export const useAccountNav = () => {
  const pathname = usePathname();
  const signOut = useSignOut();

  return {
    isActive: (href: string) => isActiveTab({ href, pathname }),
    isSigningOut: signOut.isPending,
    onSignOut: () => signOut.mutate()
  };
};
