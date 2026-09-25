import type { PlayerActivity } from '@bronevik/schemas';

import { seededRandom } from '@/shared/lib';

import type { MockActivityInput } from './mock.types';

import { mockPlayerById } from './mock-player';
import { clamp, isoDateDaysAgo, round } from './mock.helpers';

const WEEKEND = new Set([0, 6]);

export const mockActivity = ({ accountId, days }: MockActivityInput): PlayerActivity => {
  const player = mockPlayerById(accountId);
  const random = seededRandom(accountId + 404);

  const items = Array.from({ length: days }, (_, index) => {
    const offset = days - 1 - index;
    const date = isoDateDaysAgo(offset);
    const weekday = new Date(date).getDay();
    const isActive = random() < (WEEKEND.has(weekday) ? 0.82 : 0.55);
    const battles = isActive ? round(random() * random() * 48 + 2) : 0;

    return {
      date,
      battles,
      winRate: battles === 0 ? null : round(clamp(player.winRate + (random() - 0.5) * 30, 0, 100), 2)
    };
  });

  return { from: items[0].date, to: items[items.length - 1].date, days: items };
};
