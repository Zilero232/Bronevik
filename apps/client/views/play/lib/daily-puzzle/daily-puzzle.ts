import { differenceInSeconds } from 'date-fns';
import { sortBy } from 'remeda';

import { dayKey, daysBetween, nextDayStart, seededRandom, shiftDay } from '@/shared/lib';

import type { PickDailyTankInput } from './daily-puzzle.types';

import { GUESS_TANK } from '../../config';

export const puzzleDay = (now: Date) => dayKey({ date: now });

export const previousDay = (day: string) => shiftDay({ day, amount: -1 });

export const puzzleNumber = (day: string) => daysBetween({ from: GUESS_TANK.epoch, to: day }) + 1;

export const nextPuzzleAt = (now: Date) => nextDayStart({ date: now });

export const secondsUntilNextPuzzle = (now: Date) => differenceInSeconds(nextPuzzleAt(now), now, { roundingMethod: 'ceil' });

export const dailyPool = (vehicles: PickDailyTankInput['vehicles']) => {
  const preferred = vehicles.filter(({ tier, isPremium }) => tier >= GUESS_TANK.minTier && !isPremium);

  return sortBy(preferred.length > 0 ? preferred : vehicles, ({ tankId }) => tankId);
};

export const pickDailyTank = ({ vehicles, day }: PickDailyTankInput) => {
  const pool = dailyPool(vehicles);

  if (pool.length === 0) {
    return null;
  }

  const random = seededRandom(Number(day.replaceAll('-', '')));

  return pool[Math.floor(random() * pool.length)] ?? null;
};
