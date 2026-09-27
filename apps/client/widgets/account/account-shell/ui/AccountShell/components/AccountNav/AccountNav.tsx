'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ACCOUNT_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ConfirmDialog } from '@/ui-kit';

import { useAccountNav } from '../../../../model/hooks';

import s from './AccountNav.module.scss';

export const AccountNav = () => {
  const t = useTranslations('me');
  const { navRef, isActive, isSigningOut, onSignOut } = useAccountNav();

  return (
    <nav ref={navRef} aria-label={t('tabs.label')} className={s.root}>
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
      <ConfirmDialog
        trigger={
          <button className={s.signOut} disabled={isSigningOut} type='button'>
            <LogOut aria-hidden className={s.icon} size={16} />
            {t('signOut')}
          </button>
        }
        cancelLabel={t('signOutConfirm.cancel')}
        confirmLabel={t('signOut')}
        isPending={isSigningOut}
        title={t('signOutConfirm.title')}
        onConfirm={onSignOut}
      />
    </nav>
  );
};
