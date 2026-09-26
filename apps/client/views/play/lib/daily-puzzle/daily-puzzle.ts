import { addDays, differenceInCalendarDays, differenceInSeconds, format, parseISO, subDays } from 'date-fns';
import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';

import type { PickDailyTankInput } from './daily-puzzle.types';

import { GUESS_TANK } from '../../config';

const DAY_FORMAT = 'yyyy-MM-dd';

export const puzzleDay = (now: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: GUESS_TANK.timeZone }).format(now);

export const previousDay = (day: string) => format(subDays(parseISO(day), 1), DAY_FORMAT);

export const puzzleNumber = (day: string) => differenceInCalendarDays(parseISO(day), parseISO(GUESS_TANK.epoch)) + 1;

export const nextPuzzleAt = (now: Date) => addDays(parseISO(`${puzzleDay(now)}T00:00:00${GUESS_TANK.utcOffset}`), 1);

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
