'use client';

import { useTranslations } from 'next-intl';

import { ACCOUNT_NAV } from '@/shared/constants';
import { usePathname } from '@/shared/i18n/navigation';

import { useAccountMenu } from '../use-account-menu';

export const useDrawerAccountLinks = () => {
  const tMe = useTranslations('me');
  const pathname = usePathname();
  const { user } = useAccountMenu();

  const links = ACCOUNT_NAV.flatMap((group) => group.items.map((item) => ({ ...item, label: tMe(`tabs.${item.key}`) })));

  return {
    isSignedIn: Boolean(user),
    links,
    activeHref: links.some((link) => link.href === pathname) ? pathname : null
  };
};
