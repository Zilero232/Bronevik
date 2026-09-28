import { tz } from '@date-fns/tz';
import { getMonth, parse } from 'date-fns';
import { ru } from 'date-fns/locale';

import type { MonthOfInput, MoscowDateInput, RussianDateInput, YearForInput } from './russian-date.types';

import { RUSSIAN_DATE } from './russian-date.constants';

const monthOf = ({ monthName, reference }: MonthOfInput): number => getMonth(parse(monthName, RUSSIAN_DATE.monthFormat, reference, { locale: ru }));

const moscowDate = ({ year, monthName, day, hour, minute, reference }: MoscowDateInput): Date =>
  new Date(
    parse(`${day} ${monthName} ${year} ${hour}:${minute}`, RUSSIAN_DATE.dateFormat, reference, { locale: ru, in: tz(RUSSIAN_DATE.zone) }).getTime()
  );

const yearFor = ({ month, reference, explicit }: YearForInput): number => {
  if (explicit) {
    return Number(explicit);
  }

  return month < reference.getUTCMonth() - 6 ? reference.getUTCFullYear() + 1 : reference.getUTCFullYear();
};

export const parseRussianDeadlines = ({ text, reference }: RussianDateInput): Date[] =>
  [...text.matchAll(RUSSIAN_DATE.deadline)].flatMap(([, day = '', monthName = '', explicit, hour, minute]) => {
    const month = monthOf({ monthName, reference });
    const date = moscowDate({
      year: yearFor({ month, reference, explicit }),
      monthName,
      day,
      hour: hour ?? RUSSIAN_DATE.deadlineTime.hour,
      minute: minute ?? RUSSIAN_DATE.deadlineTime.minute,
      reference
    });

    return Number.isNaN(date.getTime()) ? [] : [date];
  });

export const latestDeadline = (input: RussianDateInput): Date | null => {
  const deadlines = parseRussianDeadlines(input);

  return deadlines.length === 0 ? null : new Date(Math.max(...deadlines.map((date) => date.getTime())));
};

export const parseRussianDay = ({ text, reference }: RussianDateInput): Date | null => {
  const found = RUSSIAN_DATE.day.exec(text);

  if (!found) {
    return null;
  }

  const [, day = '', monthName = '', explicit] = found;
  const month = monthOf({ monthName, reference });
  const year = explicit ? Number(explicit) : month > reference.getUTCMonth() ? reference.getUTCFullYear() - 1 : reference.getUTCFullYear();
  const date = moscowDate({ year, monthName, day, ...RUSSIAN_DATE.dayTime, reference });

  return Number.isNaN(date.getTime()) ? null : date;
};
