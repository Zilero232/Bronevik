import { eachMonthOfInterval, endOfYear, format, startOfYear } from 'date-fns';
import { ru } from 'date-fns/locale';

const MONTH_PATTERN = eachMonthOfInterval({ start: startOfYear(0), end: endOfYear(0) })
  .map((month) => format(month, 'MMMM', { locale: ru }))
  .join('|');

export const RUSSIAN_DATE = {
  deadline: new RegExp(`до\\s+(\\d{1,2})\\s+(${MONTH_PATTERN})(?:\\s+(\\d{4}))?(?:\\s*(?:г\\.?)?\\s*,?\\s*(\\d{1,2})[:.](\\d{2}))?`, 'giu'),
  day: new RegExp(`(\\d{1,2})\\s+(${MONTH_PATTERN})(?:\\s+(\\d{4}))?`, 'iu'),
  monthFormat: 'MMMM',
  dateFormat: 'd MMMM yyyy H:mm',
  deadlineTime: { hour: '23', minute: '59' },
  dayTime: { hour: '12', minute: '00' },
  zone: 'Europe/Moscow'
} as const;
