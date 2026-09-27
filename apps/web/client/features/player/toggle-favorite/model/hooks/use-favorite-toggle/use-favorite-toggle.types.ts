import type { FavoriteKind } from '@otmetki/schemas';

export type UseFavoriteToggleInput = {
  kind: FavoriteKind;
  targetId: number;
};
