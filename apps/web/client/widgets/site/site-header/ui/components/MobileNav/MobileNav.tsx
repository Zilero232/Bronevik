'use client';

import { Accordion } from '@base-ui/react/accordion';
import { useTranslations } from 'next-intl';

import { RatingPaletteToggle } from '@/features/app/rating-palette';
import { RatingPatternsToggle } from '@/features/app/rating-patterns';
import { LocaleSwitcher } from '@/features/app/switch-locale';
import { ThemeToggle } from '@/features/app/switch-theme';
import { CommandPaletteTrigger } from '@/features/search/command-palette';
import { SITE_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Drawer } from '@/ui-kit';

import type { MobileNavProps } from './MobileNav.types';

import { MOBILE_NAV } from '../../../config';
import { useSiteNav } from '../../../model/hooks';
import { GameStatusSlot } from '../GameStatusSlot';
import { DrawerAccount, DrawerAccountGroup, DrawerGroup } from './components';

import s from './MobileNav.module.scss';

export const MobileNav = ({ open, onOpenChange }: MobileNavProps) => {
  const t = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const { href, groupKey } = useSiteNav();

  return (
    <Drawer open={open} title={t('label')} onOpenChange={onOpenChange}>
      <div className={s.top}>
        <DrawerAccount onNavigate={() => onOpenChange(false)} />
        <CommandPaletteTrigger className={s.search} onOpen={() => onOpenChange(false)} />
      </div>
      <nav aria-label={t('label')} className={s.nav}>
        <Accordion.Root multiple className={s.groups} defaultValue={groupKey ? [groupKey] : []}>
          {SITE_NAV.groups.map((group) => (
            <DrawerGroup
              key={group.key}
              activeHref={href}
              isActive={groupKey === group.key}
              label={t(`groups.${group.key}`)}
              links={group.items.map((item) => ({ ...item, label: t(`items.${item.key}`) }))}
              value={group.key}
              onNavigate={() => onOpenChange(false)}
            />
          ))}
          <DrawerGroup
            activeHref={href}
            isActive={false}
            label={t(`groups.${MOBILE_NAV.projectKey}`)}
            links={MOBILE_NAV.projectItems.map((item) => ({ ...item, label: t(`items.${item.key}`) }))}
            value={MOBILE_NAV.projectKey}
            onNavigate={() => onOpenChange(false)}
          />
          <DrawerAccountGroup onNavigate={() => onOpenChange(false)} />
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
