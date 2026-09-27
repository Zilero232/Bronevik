import type { AccountRating, PlayerTank, Vehicle } from '../../../../../generated';
import type { ProfileWithChannels } from '../../streamers.types';

export type FavouriteTankRow = Pick<PlayerTank, 'battles' | 'tankId'>;

export type ToStreamerCardInput = {
  profile: ProfileWithChannels;
  rating: AccountRating | undefined;
  marks3: number | null;
  favourites: readonly FavouriteTankRow[];
  vehicles: Readonly<Record<string, Pick<Vehicle, 'name' | 'tankId'>>>;
};
