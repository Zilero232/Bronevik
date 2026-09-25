import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';

import type { PickDailyTankInput } from './daily-puzzle.types';

import { GUESS_TANK } from '../../config';

const DAY_MS = 24 * 60 * 60 * 1000;

const OFFSET_MS = GUESS_TANK.moscowOffsetHours * 60 * 60 * 1000;

const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const puzzleDay = (now: Date) => isoDay(now.getTime() + OFFSET_MS);

export const previousDay = (day: string) => isoDay(Date.parse(day) - DAY_MS);

export const puzzleNumber = (day: string) => Math.floor((Date.parse(day) - Date.parse(GUESS_TANK.epoch)) / DAY_MS) + 1;

export const msUntilNextPuzzle = (now: Date) => DAY_MS - ((now.getTime() + OFFSET_MS) % DAY_MS);

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
