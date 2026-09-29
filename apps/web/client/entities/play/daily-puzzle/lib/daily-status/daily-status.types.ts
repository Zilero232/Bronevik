import type { GuessStreak } from '../streak';

export type DailyStatusKind = 'failed' | 'fresh' | 'playing' | 'solved';

export type DailyStatus = {
  kind: DailyStatusKind;
  streak: number;
  attempts: number;
  isDone: boolean;
};

export type DailyStatusInput = {
  streak: GuessStreak;
  today: string;
  attempts: number;
};
