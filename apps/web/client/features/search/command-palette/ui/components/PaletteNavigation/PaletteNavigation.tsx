import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';

import type { PaletteNavigationProps } from './PaletteNavigation.types';

import { PALETTE_NAV_ITEMS } from '../../../config';
import { PaletteItem } from '../PaletteItem';

export const PaletteNavigation = ({ query, onSelect }: PaletteNavigationProps) => {
  const t = useTranslations('search');
  const tNav = useTranslations('nav');

  const needle = query.trim().toLocaleLowerCase();
  const items = PALETTE_NAV_ITEMS.map((item) => ({ key: item.key, href: item.href, label: tNav(`items.${item.key}`) })).filter(
    (item) => !needle || item.label.toLocaleLowerCase().includes(needle)
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <Command.Group heading={t('sections')}>
      {items.map((item) => (
        <PaletteItem key={item.key} meta={item.href} title={item.label} value={`nav-${item.key}`} onSelect={() => onSelect(item.href)} />
      ))}
    </Command.Group>
  );
};
