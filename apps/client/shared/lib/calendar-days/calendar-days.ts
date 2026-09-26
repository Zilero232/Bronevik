import { tz, TZDate } from '@date-fns/tz';
import { addDays, differenceInCalendarDays, format, parseISO, startOfDay, startOfISOWeek } from 'date-fns';

import { TIME_ZONE } from '@/shared/i18n';

import type { DaysBetweenInput, DaysUntilInput, ShiftDayInput, ZonedDayInput } from './calendar-days.types';

import { CALENDAR_DAYS } from './calendar-days.constants';

const zoned = ({ date, timeZone = TIME_ZONE }: ZonedDayInput): TZDate =>
  typeof date === 'string' ? parseISO(date, { in: tz(timeZone) }) : new TZDate(+date, timeZone);

export const dayKey = ({ date, timeZone = TIME_ZONE }: ZonedDayInput): string =>
  format(zoned({ date, timeZone }), CALENDAR_DAYS.dayFormat, { in: tz(timeZone) });

export const weekKey = ({ date, timeZone = TIME_ZONE }: ZonedDayInput): string =>
  format(startOfISOWeek(zoned({ date, timeZone }), { in: tz(timeZone) }), CALENDAR_DAYS.dayFormat, { in: tz(timeZone) });

export const daysBetween = ({ from, to, timeZone = TIME_ZONE }: DaysBetweenInput): number =>
  differenceInCalendarDays(zoned({ date: to, timeZone }), zoned({ date: from, timeZone }), { in: tz(timeZone) });

export const daysUntil = ({ date, now, timeZone = TIME_ZONE }: DaysUntilInput): number => daysBetween({ from: now, to: date, timeZone });

export const nextDayStart = ({ date, timeZone = TIME_ZONE }: ZonedDayInput): Date =>
  new Date(startOfDay(addDays(zoned({ date, timeZone }), 1, { in: tz(timeZone) }), { in: tz(timeZone) }).getTime());

export const shiftDay = ({ day, amount, timeZone = TIME_ZONE }: ShiftDayInput): string =>
  format(addDays(zoned({ date: day, timeZone }), amount, { in: tz(timeZone) }), CALENDAR_DAYS.dayFormat, { in: tz(timeZone) });
