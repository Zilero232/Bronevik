'use client';

import { ROUTES } from '@/shared/constants';
import { usePathname } from '@/shared/i18n/navigation';
import { useHydrated } from '@/shared/lib';

import { safeReturnPath } from '../../../lib/return-path';

export const useLoginHref = (): string => {
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const next = safeReturnPath(`${pathname}${isHydrated ? window.location.search : ''}`);

  return next ? ROUTES.auth.loginNext(next) : ROUTES.auth.login;
};
