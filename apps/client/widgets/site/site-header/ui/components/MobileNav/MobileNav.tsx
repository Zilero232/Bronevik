'use client';

import { useTranslations } from 'next-intl';

import { RatingPaletteToggle } from '@/features/app/rating-palette';
import { RatingPatternsToggle } from '@/features/app/rating-patterns';
import { LocaleSwitcher } from '@/features/app/switch-locale';
import { ThemeToggle } from '@/features/app/switch-theme';
import { SITE_NAV, SITE_NAV_MORE } from '@/shared/constants';
import { Link, usePathname } from '@/shared/i18n/navigation';
import { Drawer } from '@/ui-kit';

import type { MobileNavProps } from './MobileNav.types';

import s from './MobileNav.module.scss';

export const MobileNav = ({ open, onOpenChange }: MobileNavProps) => {
  const t = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const pathname = usePathname();

  return (
    <Drawer open={open} title={t('label')} onOpenChange={onOpenChange}>
      <nav className={s.list}>
        {[...SITE_NAV, ...SITE_NAV_MORE].map((item) => (
          <Link key={item.key} className={s.link} data-active={pathname.startsWith(item.href)} href={item.href} onClick={() => onOpenChange(false)}>
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className={s.settings}>
        <span className={s.heading}>{tSettings('title')}</span>
        <div className={s.row}>
          <span>{tSettings('language')}</span>
          <LocaleSwitcher />
        </div>
        <div className={s.row}>
          <span>{tSettings('theme')}</span>
          <ThemeToggle />
        </div>
        <RatingPatternsToggle />
        <RatingPaletteToggle />
      </div>
    </Drawer>
  );
};
