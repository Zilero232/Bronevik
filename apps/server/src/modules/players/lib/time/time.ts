import { tz } from '@date-fns/tz';
import { format, startOfDay } from 'date-fns';

import { TIME } from '../../../../config';

const moscow = tz(TIME.zone);

export const moscowDay = (date: Date): string => format(date, 'yyyy-MM-dd', { in: moscow });

export const moscowDayStart = (date: Date): Date => new Date(startOfDay(date, { in: moscow }).getTime());
