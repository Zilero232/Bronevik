import type { ServerFiguresInput, ServerFiguresState } from './server-figures.types';

const isPositive = (value: number | null) => value !== null && value > 0;

export const serverFiguresState = ({ isPending, isError, trackedPlayers, online }: ServerFiguresInput): ServerFiguresState => {
  if (isError) {
    return 'error';
  }

  if (isPending) {
    return 'pending';
  }

  return isPositive(trackedPlayers) || isPositive(online) ? 'ready' : 'empty';
};
