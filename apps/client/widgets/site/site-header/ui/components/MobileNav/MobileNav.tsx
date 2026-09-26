'use client';

import { Accordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { RatingPaletteToggle } from '@/features/app/rating-palette';
import { RatingPatternsToggle } from '@/features/app/rating-patterns';
import { LocaleSwitcher } from '@/features/app/switch-locale';
import { ThemeToggle } from '@/features/app/switch-theme';
import { SITE_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Drawer } from '@/ui-kit';

import type { MobileNavProps } from './MobileNav.types';

import { useSiteNav } from '../../../model/hooks';
import { GameStatusSlot } from '../GameStatusSlot';

import s from './MobileNav.module.scss';

export const MobileNav = ({ open, onOpenChange }: MobileNavProps) => {
  const t = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const { href, groupKey } = useSiteNav();

  return (
    <Drawer open={open} title={t('label')} onOpenChange={onOpenChange}>
      <nav aria-label={t('label')} className={s.nav}>
        <Accordion.Root multiple className={s.groups} defaultValue={groupKey ? [groupKey] : []}>
          {SITE_NAV.groups.map((group) => (
            <Accordion.Item key={group.key} className={s.group} value={group.key}>
              <Accordion.Header className={s.header}>
                <Accordion.Trigger className={s.trigger} data-active={groupKey === group.key}>
                  {t(`groups.${group.key}`)}
                  <ChevronDown aria-hidden className={s.chevron} size={18} />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className={s.panel}>
                <ul className={s.links}>
                  {group.items.map((item) => (
                    <li key={item.key}>
                      <Link
                        aria-current={href === item.href ? 'page' : undefined}
                        className={s.link}
                        data-active={href === item.href}
                        href={item.href}
                        onClick={() => onOpenChange(false)}
                      >
                        <item.icon aria-hidden size={16} />
                        {t(`items.${item.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
        {[SITE_NAV.tools, SITE_NAV.plus].map((item) => (
          <Link
            key={item.key}
            aria-current={href === item.href ? 'page' : undefined}
            className={s.trigger}
            data-active={href === item.href}
            href={item.href}
            onClick={() => onOpenChange(false)}
          >
            {t(`items.${item.key}`)}
            <item.icon aria-hidden size={18} />
          </Link>
        ))}
      </nav>
      <div className={s.settings}>
        <span className={s.heading}>{tSettings('title')}</span>
        <GameStatusSlot className={s.status} />
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
