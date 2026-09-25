'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SITE_NAV } from '@/shared/constants';
import { Link, usePathname } from '@/shared/i18n/navigation';
import { SPRING } from '@/shared/lib';

import type { SiteNavProps } from './SiteNav.types';

import s from './SiteNav.module.scss';

export const SiteNav = ({ className }: SiteNavProps) => {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')} className={clsx(s.root, className)}>
      {SITE_NAV.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link key={item.key} aria-current={isActive ? 'page' : undefined} className={s.link} data-active={isActive} href={item.href}>
            {t(item.key)}
            {isActive && <motion.span className={s.underline} layoutId='site-nav-underline' transition={SPRING} />}
          </Link>
        );
      })}
    </nav>
  );
};
