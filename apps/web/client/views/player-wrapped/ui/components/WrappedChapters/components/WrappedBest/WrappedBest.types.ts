import type { PlayerWrappedBattle } from '@/entities/player/profile';

import type { WrappedChaptersProps } from '../../WrappedChapters.types';

export type WrappedBestProps = Pick<WrappedChaptersProps, 'bestVehicle'> & {
  bestBattle: PlayerWrappedBattle;
};
