import type { FavoriteKind } from '@bronevik/schemas';

export type UseFavoriteToggleInput = {
  kind: FavoriteKind;
  targetId: number;
};
