'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { RatingPaletteToggle } from '@/features/app/rating-palette';
import { RatingPatternsToggle } from '@/features/app/rating-patterns';
import { LocaleSwitcher } from '@/features/app/switch-locale';
import { ThemeToggle } from '@/features/app/switch-theme';
import { SITE_NAV, SITE_NAV_ICONS } from '@/shared/constants';
import { Link, usePathname } from '@/shared/i18n/navigation';
import { STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { Drawer } from '@/ui-kit';

import type { MobileNavProps } from './MobileNav.types';

import s from './MobileNav.module.scss';

export const MobileNav = ({ open, onOpenChange }: MobileNavProps) => {
  const t = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const pathname = usePathname();

  return (
    <Drawer open={open} title={t('label')} onOpenChange={onOpenChange}>
      <motion.nav animate='visible' className={s.list} initial='hidden' variants={STAGGER}>
        {SITE_NAV.map((item, index) => {
          const Icon = SITE_NAV_ICONS[item.key];

          return (
            <motion.div key={item.key} variants={STAGGER_ITEM}>
              <Link className={s.link} data-active={pathname.startsWith(item.href)} href={item.href} onClick={() => onOpenChange(false)}>
                <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
                <Icon className={s.icon} size={20} strokeWidth={1.75} />
                {t(item.key)}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>
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
