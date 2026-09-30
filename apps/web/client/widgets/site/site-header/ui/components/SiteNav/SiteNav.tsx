'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { SITE_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { SiteNavProps } from './SiteNav.types';

import { NAV_MENU } from '../../../config';
import { useSiteNav } from '../../../model/hooks';
import { NavPanel } from './components';
import { NAV_INDICATOR } from './SiteNav.motion';

import s from './SiteNav.module.scss';

export const SiteNav = ({ className }: SiteNavProps) => {
  const t = useTranslations('nav');
  const { href, entryKey, value, indicatorKey, onValueChange, onHover, onLeave } = useSiteNav();

  return (
    <NavigationMenu.Root
      aria-label={t('label')}
      className={clsx(s.root, className)}
      closeDelay={NAV_MENU.closeDelay}
      delay={NAV_MENU.openDelay}
      value={value}
      onValueChange={onValueChange}
    >
      <NavigationMenu.List className={s.list} onPointerLeave={onLeave}>
        {SITE_NAV.menu.map((entry) =>
          'items' in entry ? (
            <NavigationMenu.Item key={entry.key} value={entry.key} onPointerEnter={() => onHover(entry.key)}>
              <NavigationMenu.Trigger className={s.trigger} data-active={entryKey === entry.key}>
                {t(`groups.${entry.key}`)}
                <NavigationMenu.Icon className={s.chevron}>
                  <ChevronDown aria-hidden size={14} />
                </NavigationMenu.Icon>
                {indicatorKey === entry.key && <m.span aria-hidden className={s.indicator} {...NAV_INDICATOR} />}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className={s.content}>
                <NavPanel activeHref={href} group={entry} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={entry.key} onPointerEnter={() => onHover(entry.key)}>
              <NavigationMenu.Link
                active={entryKey === entry.key}
                aria-current={entryKey === entry.key ? 'page' : undefined}
                className={s.trigger}
                data-active={entryKey === entry.key}
                render={<Link href={entry.href} />}
              >
                {t(`short.${entry.key}`)}
                {indicatorKey === entry.key && <m.span aria-hidden className={s.indicator} {...NAV_INDICATOR} />}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          )
        )}
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Backdrop className={s.backdrop} />
        <NavigationMenu.Positioner align='start' className={s.positioner} collisionPadding={16} sideOffset={NAV_MENU.sideOffset}>
          <NavigationMenu.Popup className={s.popup}>
            <NavigationMenu.Viewport className={s.viewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};
