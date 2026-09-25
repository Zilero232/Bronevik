import type { Playtime } from '@bronevik/schemas';

import { seededRandom } from '@/shared/lib';

import { mockPlayerById } from './mock-player';
import { clamp, round } from './mock.helpers';

const HOURS = 24;
const WEEKDAYS = 7;
const PEAK_HOUR = 21;

export const mockPlaytime = (accountId: number): Playtime => {
  const player = mockPlayerById(accountId);
  const random = seededRandom(accountId + 2_024);

  const cells = Array.from({ length: WEEKDAYS * HOURS }, (_, index) => {
    const weekday = Math.floor(index / HOURS);
    const hour = index % HOURS;
    const distance = Math.min(Math.abs(hour - PEAK_HOUR), HOURS - Math.abs(hour - PEAK_HOUR));
    const presence = Math.max(0, 1 - distance / 8) * (weekday >= 5 ? 1.4 : 1);
    const battles = round(presence * presence * (80 + random() * 160));
    const fatigue = hour >= 0 && hour < 5 ? -5 : 0;

    return {
      weekday,
      hour,
      battles,
      winRate: battles < 5 ? null : round(clamp(player.winRate + fatigue + (random() - 0.5) * 8, 0, 100), 2),
      avgDamage: battles < 5 ? null : round(player.avgDamage * (1 + fatigue / 100 + (random() - 0.5) * 0.2))
    };
  });

  return { battles: cells.reduce((total, cell) => total + cell.battles, 0), source: 'battles', cells };
};
