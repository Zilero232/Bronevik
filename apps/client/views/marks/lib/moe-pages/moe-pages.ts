import type { Paginated } from '@bronevik/schemas';

export const nextOffset = <T>({ items, total, offset }: Paginated<T>): number | undefined => {
  const next = offset + items.length;

  return items.length > 0 && next < total ? next : undefined;
};
