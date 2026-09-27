import { channelLinks } from '@/entities/streamer/channel';
import { ratingTone } from '@/shared/lib';

import type { DirectoryEntry, DirectoryEntryInput, FavouriteTankView } from './directory-entry.types';

import { DIRECTORY } from '../../config';

const favouritesOf = ({ card, index }: DirectoryEntryInput): FavouriteTankView[] =>
  card.favouriteTanks.slice(0, DIRECTORY.favourites).map(({ tankId, name }) => {
    const vehicle = index[tankId] ?? null;

    return { tankId, name: vehicle?.name ?? name ?? `#${tankId}`, vehicle };
  });

export const directoryEntry = ({ card, index }: DirectoryEntryInput): DirectoryEntry => ({
  card,
  channels: channelLinks(card.channels),
  favourites: favouritesOf({ card, index }),
  stats: card.stats && {
    battles: card.stats.battles,
    winRate: card.stats.winRate,
    winRateTone: card.stats.winRate === null ? null : ratingTone({ scale: 'winRate', value: card.stats.winRate }),
    wn8: card.stats.wn8,
    wn8Tone: card.stats.wn8 === null ? null : ratingTone({ scale: 'wn8', value: card.stats.wn8 })
  }
});
