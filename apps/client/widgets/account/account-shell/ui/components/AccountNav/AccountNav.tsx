'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link, usePathname } from '@/shared/i18n/navigation';
import { SPRING } from '@/shared/lib';

import { ACCOUNT_TABS } from '../../../config';

import s from './AccountNav.module.scss';

export const AccountNav = () => {
  const t = useTranslations('me.tabs');
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')} className={s.root}>
      <div className={s.rail}>
        {ACCOUNT_TABS.map(({ key, href, icon: Icon }) => {
          const isActive = href === ROUTES.me ? pathname === href : pathname.startsWith(href);

          return (
            <Link key={key} aria-current={isActive ? 'page' : undefined} className={s.tab} data-active={isActive} href={href}>
              {isActive && <motion.span className={s.plate} layoutId='account-tab' transition={SPRING} />}
              <Icon aria-hidden className={s.icon} size={15} />
              <span className={s.label}>{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
