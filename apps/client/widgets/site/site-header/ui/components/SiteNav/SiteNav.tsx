'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
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
  const { href, groupKey, isToolsActive, value, indicatorKey, onValueChange, onHover, onLeave } = useSiteNav();

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
        {SITE_NAV.groups.map((group) => (
          <NavigationMenu.Item key={group.key} value={group.key} onPointerEnter={() => onHover(group.key)}>
            <NavigationMenu.Trigger className={s.trigger} data-active={groupKey === group.key}>
              {t(`groups.${group.key}`)}
              <NavigationMenu.Icon className={s.chevron}>
                <ChevronDown aria-hidden size={14} />
              </NavigationMenu.Icon>
              {indicatorKey === group.key && <motion.span aria-hidden className={s.indicator} {...NAV_INDICATOR} />}
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className={s.content}>
              <NavPanel activeHref={href} group={group} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        ))}
        <NavigationMenu.Item onPointerEnter={() => onHover(SITE_NAV.tools.key)}>
          <NavigationMenu.Link
            active={isToolsActive}
            aria-current={isToolsActive ? 'page' : undefined}
            className={s.trigger}
            data-active={isToolsActive}
            render={<Link href={SITE_NAV.tools.href} />}
          >
            {t(`items.${SITE_NAV.tools.key}`)}
            {indicatorKey === SITE_NAV.tools.key && <motion.span aria-hidden className={s.indicator} {...NAV_INDICATOR} />}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
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
