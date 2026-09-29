import type { ShortListInput } from './short-list.types';

export const shortList = ({ items, max }: ShortListInput): string => {
  const shown = items.slice(0, max).join(', ');
  const hidden = items.length - max;

  return hidden > 0 ? `${shown} +${hidden}` : shown;
};
