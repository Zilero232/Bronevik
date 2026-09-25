import type { PlayerIdentityData } from '../model/player.types';

export type PlayerIdentityProps = {
  player: PlayerIdentityData;
  size?: 'lg' | 'md';
  className?: string;
};
