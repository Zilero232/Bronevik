'use client';

import { NATIONS, TANK_CLASSES } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

export const useIconFilterTitle = () => {
  const tGame = useTranslations('game');
  const tCommon = useTranslations('common');

  return (value: number | string): string => {
    const tankClass = TANK_CLASSES.find((item) => item === value);
    const nation = NATIONS.find((item) => item === value);

    if (tankClass) {
      return tGame(`classes.${tankClass}`);
    }

    if (nation) {
      return tGame(`nations.${nation}`);
    }

    return tCommon('tier', { tier: Number(value) });
  };
};
