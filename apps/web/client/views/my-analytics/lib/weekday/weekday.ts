import type { WeekdayStat } from '@otmetki/schemas';

import { millisecondsInDay } from 'date-fns/constants';
import { sortBy } from 'remeda';

import { ANALYTICS_VIEW } from '../../config';

const order: readonly number[] = ANALYTICS_VIEW.weekdayOrder;

export const weekdayDate = (weekday: number): Date => new Date(ANALYTICS_VIEW.weekdayAnchor + weekday * millisecondsInDay);

export const orderWeekdays = (days: readonly WeekdayStat[]): WeekdayStat[] => sortBy(days, (day) => order.indexOf(day.weekday));
