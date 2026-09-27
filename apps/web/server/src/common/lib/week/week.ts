import { tz } from '@date-fns/tz';
import { addDays, startOfISOWeek } from 'date-fns';

import type { WeekWindow } from './week.types';

import { TIME } from '../../../config';
import { moscowCalendarDate } from '../moscow-time';

const moscow = tz(TIME.zone);

export const weekWindow = (date: Date): WeekWindow => {
  const start = startOfISOWeek(date, { in: moscow });

  return { start: new Date(start.getTime()), end: new Date(addDays(start, 7).getTime()), weekStart: moscowCalendarDate(start) };
};

export const previousWeek = (now: Date): WeekWindow => weekWindow(addDays(now, -7));
