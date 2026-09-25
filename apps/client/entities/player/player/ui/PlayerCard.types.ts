import type { PlayerStats } from '../model/player.types';

export type PlayerCardProps = {
  player: PlayerStats;
  rank?: number;
  className?: string;
};
