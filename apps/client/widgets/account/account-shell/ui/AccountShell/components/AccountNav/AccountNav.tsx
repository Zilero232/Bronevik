'use client';

import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/shared/i18n/navigation';

import { ACCOUNT_TABS } from '../../../../config';
import { isActiveTab } from '../../../../lib/active-tab';

import s from './AccountNav.module.scss';

export const AccountNav = () => {
  const t = useTranslations('me.tabs');
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')} className={s.root}>
      {ACCOUNT_TABS.map(({ key, href }) => {
        const isActive = isActiveTab({ href, pathname });

        return (
          <Link key={key} aria-current={isActive ? 'page' : undefined} className={s.tab} data-active={isActive} href={href}>
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
};
