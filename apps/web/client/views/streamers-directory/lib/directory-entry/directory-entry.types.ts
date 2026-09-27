import type { StreamerCard, StreamerChannel, VehicleSummary } from '@otmetki/schemas';

import type { RatingTone } from '@/shared/lib';

export type FavouriteTankView = {
  tankId: number;
  name: string;
  vehicle: VehicleSummary | null;
};

export type DirectoryStats = {
  battles: number;
  winRate: number | null;
  winRateTone: RatingTone | null;
  wn8: number | null;
  wn8Tone: RatingTone | null;
};

export type DirectoryEntry = {
  card: StreamerCard;
  channels: StreamerChannel[];
  favourites: FavouriteTankView[];
  stats: DirectoryStats | null;
};

export type DirectoryEntryInput = {
  card: StreamerCard;
  index: Partial<Record<number, VehicleSummary>>;
};
