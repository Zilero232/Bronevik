import { UTCDate } from '@date-fns/utc';
import { addDays, startOfISOWeek } from 'date-fns';

import type { WeekWindow } from './week.types';

export const weekWindow = (date: Date): WeekWindow => {
  const start = startOfISOWeek(new UTCDate(date.getTime()));

  return { start: new Date(start.getTime()), end: new Date(addDays(start, 7).getTime()) };
};

export const previousWeek = (now: Date): WeekWindow => weekWindow(addDays(now, -7));
