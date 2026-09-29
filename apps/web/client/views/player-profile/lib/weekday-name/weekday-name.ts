import { addDays } from 'date-fns';

import type { WeekdayNameInput } from './weekday-name.types';

import { WEEKDAY_NAME } from '../../config';

export const weekdayName = ({ locale, index, width = 'long' }: WeekdayNameInput) =>
  new Intl.DateTimeFormat(locale, { weekday: width, timeZone: 'UTC' }).format(addDays(WEEKDAY_NAME.firstMonday, index));
