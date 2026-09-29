'use client';

import { PROMO_BOARD, PROMO_ITEMS } from '../../../config';
import { resolvePromos } from '../../../lib/resolve-promos';
import { usePromoSources } from '../use-promo-sources';

export const usePromoShowcase = () => {
  const { isModpackPublished, tanks } = usePromoSources();

  return { items: resolvePromos({ ids: PROMO_BOARD.showcase, specs: PROMO_ITEMS, isModpackPublished, tanks }) };
};
