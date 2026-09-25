import type { FavoriteKind } from '@bronevik/schemas';

export type FavoriteButtonProps = {
  kind: FavoriteKind;
  targetId: number;
  className?: string;
};
