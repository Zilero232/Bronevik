import { PAGINATION } from '@otmetki/schemas';

import type { OffsetPage } from './page-offset.types';

export const nextPageOffset = ({ items, total, offset }: OffsetPage): number | undefined => {
  const next = offset + items.length;

  return items.length > 0 && next < total && next <= PAGINATION.maxOffset ? next : undefined;
};
