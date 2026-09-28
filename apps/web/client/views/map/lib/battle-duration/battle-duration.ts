import type { TeamShareInput } from './battle-duration.types';

export const teamShare = ({ team1, team2 }: TeamShareInput) => {
  const total = team1 + team2;

  return total > 0 ? team1 / total : 0.5;
};
