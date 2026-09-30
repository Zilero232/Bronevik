'use client';

import { useFormatter } from 'next-intl';

import { MOD_PAGE } from '../../../config';
import { showcaseCount } from '../../../lib/showcase';

export const useModFigures = () => {
  const format = useFormatter();

  return {
    components: showcaseCount(),
    presets: MOD_PAGE.presetCount,
    price: format.number(MOD_PAGE.price, { style: 'currency', currency: MOD_PAGE.currency, maximumFractionDigits: 0 })
  };
};
