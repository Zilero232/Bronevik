'use client';

import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { NavPanelLinkProps } from './NavPanelLink.types';

import s from './NavPanelLink.module.scss';

export const NavPanelLink = ({ item, isActive }: NavPanelLinkProps) => {
  const t = useTranslations('nav');

  return (
    <NavigationMenu.Link
      closeOnClick
      active={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={s.root}
      render={<Link href={item.href} />}
    >
      <span aria-hidden className={s.icon}>
        <item.icon size={18} />
      </span>
      <span className={s.text}>
        <span className={s.title}>{t(`items.${item.key}`)}</span>
        <span className={s.hint}>{t(`hints.${item.key}`)}</span>
      </span>
    </NavigationMenu.Link>
  );
};
