import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';

import type { PaletteNavigationProps } from './PaletteNavigation.types';

import { usePaletteNavigation } from '../../../model/hooks';
import { PaletteItem } from '../PaletteItem';

export const PaletteNavigation = ({ query, onSelect }: PaletteNavigationProps) => {
  const t = useTranslations('search');
  const items = usePaletteNavigation(query);

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
