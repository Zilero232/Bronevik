'use client';

import { useTranslations } from 'next-intl';

import { PALETTE_NAV_ITEMS } from '../../../config';

export const usePaletteNavigation = (query: string) => {
  const tNav = useTranslations('nav');

  const needle = query.trim().toLocaleLowerCase();

  return PALETTE_NAV_ITEMS.map((item) => ({ key: item.key, href: item.href, label: tNav(`items.${item.key}`) })).filter(
    (item) => !needle || item.label.toLocaleLowerCase().includes(needle)
  );
};
