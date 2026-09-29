import type { GuessStreak } from '../lib/streak/streak.types';

export const EMPTY_STREAK = { current: 0, best: 0, played: 0, wins: 0, lastDay: null } as const satisfies GuessStreak;
