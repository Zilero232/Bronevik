import { Command } from 'cmdk';
import { Palette } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES, SITE_NAV, SITE_NAV_ICONS } from '@/shared/constants';

import type { PaletteNavigationProps } from './PaletteNavigation.types';

import { PaletteItem } from '../PaletteItem';

export const PaletteNavigation = ({ query, onSelect }: PaletteNavigationProps) => {
  const t = useTranslations('search');
  const tNav = useTranslations('nav');

  const needle = query.trim().toLocaleLowerCase();
  const items = [
    ...SITE_NAV.map((item) => ({ key: item.key, href: item.href, label: tNav(item.key), icon: SITE_NAV_ICONS[item.key] })),
    { key: 'design', href: ROUTES.design, label: tNav('design'), icon: Palette }
  ].filter((item) => !needle || item.label.toLocaleLowerCase().includes(needle));

  if (items.length === 0) {
    return null;
  }

  return (
    <Command.Group heading={t('sections')}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <PaletteItem
            key={item.key}
            icon={<Icon size={20} strokeWidth={1.75} />}
            meta={item.href}
            title={item.label}
            value={`nav-${item.key}`}
            onSelect={() => onSelect(item.href)}
          />
        );
      })}
    </Command.Group>
  );
};
