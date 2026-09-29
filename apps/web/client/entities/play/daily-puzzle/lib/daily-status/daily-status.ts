import type { DailyStatus, DailyStatusInput, DailyStatusKind } from './daily-status.types';

import { activeStreak } from '../streak';

const statusKind = ({ streak, today, attempts }: DailyStatusInput): DailyStatusKind => {
  if (streak.lastDay === today) {
    return streak.current > 0 ? 'solved' : 'failed';
  }

  return attempts > 0 ? 'playing' : 'fresh';
};

export const dailyStatus = (input: DailyStatusInput): DailyStatus => {
  const kind = statusKind(input);

  return {
    kind,
    streak: activeStreak({ streak: input.streak, today: input.today }),
    attempts: input.attempts,
    isDone: kind === 'solved' || kind === 'failed'
  };
};
