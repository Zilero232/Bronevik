import { addDays } from 'date-fns';

import type { WeekdayNameInput } from './weekday-name.types';

const FIRST_MONDAY = Date.UTC(2024, 0, 1);

export const weekdayName = ({ locale, index, width = 'long' }: WeekdayNameInput) =>
  new Intl.DateTimeFormat(locale, { weekday: width, timeZone: 'UTC' }).format(addDays(FIRST_MONDAY, index));
