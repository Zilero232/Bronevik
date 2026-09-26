import type { WatchlistPlayer } from '@otmetki/schemas';

export type RemoveCellProps = {
  player: WatchlistPlayer;
  isDisabled: boolean;
  onRemove: (player: WatchlistPlayer) => void;
};
