import type { FavoriteKind } from '@otmetki/schemas';

export type FavoriteButtonProps = {
  kind: FavoriteKind;
  targetId: number;
  className?: string;
};
