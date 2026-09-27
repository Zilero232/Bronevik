import type { TeamShareInput } from './battle-duration.types';

export const splitDuration = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.round(totalSeconds));

  return { minutes: Math.floor(seconds / 60), seconds: seconds % 60 };
};

export const teamShare = ({ team1, team2 }: TeamShareInput) => {
  const total = team1 + team2;

  return total > 0 ? team1 / total : 0.5;
};
