import type { ActiveStreakInput, GuessStreak, RecordResultInput } from './streak.types';

import { previousDay } from '../puzzle-day';

export const recordResult = ({ streak, day, isWon }: RecordResultInput): GuessStreak => {
  if (streak.lastDay === day) {
    return streak;
  }

  const isConsecutive = streak.lastDay === previousDay(day);
  const current = isWon ? (isConsecutive ? streak.current + 1 : 1) : 0;

  return {
    current,
    best: Math.max(streak.best, current),
    played: streak.played + 1,
    wins: streak.wins + (isWon ? 1 : 0),
    lastDay: day
  };
};

export const activeStreak = ({ streak, today }: ActiveStreakInput) =>
  streak.lastDay === today || streak.lastDay === previousDay(today) ? streak.current : 0;
