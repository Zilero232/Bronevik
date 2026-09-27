import type { MoscowDateInput, RussianDateInput, YearForInput } from './russian-date.types';

import { RUSSIAN_MONTHS, SCRAPE } from '../scrape.constants';
import { RUSSIAN_DATE } from './russian-date.constants';

const isMonth = (value: string): value is keyof typeof RUSSIAN_MONTHS => value in RUSSIAN_MONTHS;

const pad = (value: number): string => String(value).padStart(2, '0');

const moscowDate = ({ year, month, day, hour, minute }: MoscowDateInput): Date =>
  new Date(`${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${SCRAPE.moscowOffset}`);

const yearFor = ({ month, reference, explicit }: YearForInput): number => {
  if (explicit) {
    return Number(explicit);
  }

  return month < reference.getUTCMonth() - 6 ? reference.getUTCFullYear() + 1 : reference.getUTCFullYear();
};

export const parseRussianDeadlines = ({ text, reference }: RussianDateInput): Date[] =>
  [...text.matchAll(RUSSIAN_DATE.deadline)].flatMap((found) => {
    const monthName = found[2]?.toLowerCase() ?? '';

    if (!isMonth(monthName)) {
      return [];
    }

    const month = RUSSIAN_MONTHS[monthName];
    const date = moscowDate({
      year: yearFor({ month, reference, explicit: found[3] }),
      month,
      day: Number(found[1]),
      hour: found[4] ? Number(found[4]) : 23,
      minute: found[5] ? Number(found[5]) : 59
    });

    return Number.isNaN(date.getTime()) ? [] : [date];
  });

export const latestDeadline = (input: RussianDateInput): Date | null => {
  const deadlines = parseRussianDeadlines(input);

  return deadlines.length === 0 ? null : new Date(Math.max(...deadlines.map((date) => date.getTime())));
};

export const parseRussianDay = ({ text, reference }: RussianDateInput): Date | null => {
  const found = RUSSIAN_DATE.day.exec(text);
  const monthName = found?.[2]?.toLowerCase() ?? '';

  if (!found || !isMonth(monthName)) {
    return null;
  }

  const month = RUSSIAN_MONTHS[monthName];
  const year = found[3] ? Number(found[3]) : month > reference.getUTCMonth() ? reference.getUTCFullYear() - 1 : reference.getUTCFullYear();
  const date = moscowDate({ year, month, day: Number(found[1]), hour: 12, minute: 0 });

  return Number.isNaN(date.getTime()) ? null : date;
};
