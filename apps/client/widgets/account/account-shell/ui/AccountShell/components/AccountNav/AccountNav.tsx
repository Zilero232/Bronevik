'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ACCOUNT_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import { useAccountNav } from '../../../../model/hooks';

import s from './AccountNav.module.scss';

export const AccountNav = () => {
  const t = useTranslations('me');
  const { isActive, isSigningOut, onSignOut } = useAccountNav();

  return (
    <nav aria-label={t('tabs.label')} className={s.root}>
      {ACCOUNT_NAV.map((group) => (
        <section key={group.key} aria-labelledby={`account-nav-${group.key}`} className={s.group}>
          <h2 className={s.heading} id={`account-nav-${group.key}`}>
            {t(`tabs.groups.${group.key}`)}
          </h2>
          <ul className={s.list}>
            {group.items.map((item) => (
              <li key={item.key}>
                <Link aria-current={isActive(item.href) ? 'page' : undefined} className={s.link} data-active={isActive(item.href)} href={item.href}>
                  <item.icon aria-hidden className={s.icon} size={16} />
                  {t(`tabs.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <button className={s.signOut} disabled={isSigningOut} type='button' onClick={onSignOut}>
        <LogOut aria-hidden className={s.icon} size={16} />
        {t('signOut')}
      </button>
    </nav>
  );
};
