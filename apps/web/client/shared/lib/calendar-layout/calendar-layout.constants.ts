import { daysInWeek } from 'date-fns/constants';

export const CALENDAR_LAYOUT = {
  minLabelGapWeeks: 3,
  monthStartSuffix: '-01',
  steps: { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -daysInWeek, ArrowRight: daysInWeek }
} as const;
