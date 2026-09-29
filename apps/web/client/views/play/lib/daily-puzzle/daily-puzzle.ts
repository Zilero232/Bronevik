import { sortBy } from 'remeda';

import { daySeed } from '@/entities/play/daily-puzzle';
import { seededRandom } from '@/shared/lib';

import type { PickDailyTankInput } from './daily-puzzle.types';

import { GUESS_TANK } from '../../config';
import { legacyRandom } from '../legacy-random';

export const dailyPool = (vehicles: PickDailyTankInput['vehicles']) => {
  const preferred = vehicles.filter(({ tier, isPremium }) => tier >= GUESS_TANK.minTier && !isPremium);

  return sortBy(preferred.length > 0 ? preferred : vehicles, ({ tankId }) => tankId);
};

export const pickDailyTank = ({ vehicles, day }: PickDailyTankInput) => {
  const pool = dailyPool(vehicles);

  if (pool.length === 0) {
    return null;
  }

  const seed = daySeed(day);
  const random = day < GUESS_TANK.generatorSwitchDay ? legacyRandom(seed) : seededRandom(seed);

  return pool[Math.floor(random() * pool.length)] ?? null;
};
