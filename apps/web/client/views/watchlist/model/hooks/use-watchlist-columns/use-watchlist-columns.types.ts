import type { WatchlistPlayer } from '@otmetki/schemas';

export type UseWatchlistColumnsInput = {
  isRemoving: boolean;
  onRemove: (player: WatchlistPlayer) => void;
};
