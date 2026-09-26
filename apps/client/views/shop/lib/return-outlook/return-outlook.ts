import type { CalendarDayInput, ReturnOutlook, ReturnOutlookInput } from './return-outlook.types';

import { SHOP_CALENDAR } from '../../config';

const calendarDay = ({ date, timeZone }: CalendarDayInput): number => {
  const isoDate = new Intl.DateTimeFormat(SHOP_CALENDAR.isoLocale, { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

  return Math.round(Date.parse(`${isoDate}${SHOP_CALENDAR.midnightSuffix}`) / SHOP_CALENDAR.msPerDay);
};

export const returnOutlook = ({ nextExpectedAt, now, soonDays, timeZone }: ReturnOutlookInput): ReturnOutlook => {
  if (nextExpectedAt === null) {
    return { state: 'unknown', days: null };
  }

  const days = calendarDay({ date: new Date(nextExpectedAt), timeZone }) - calendarDay({ date: now, timeZone });

  if (days < 0) {
    return { state: 'overdue', days: -days };
  }

  return { state: days <= soonDays ? 'soon' : 'later', days };
};
