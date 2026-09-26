import { differenceInCalendarDays } from 'date-fns';

import type { ReturnOutlook, ReturnOutlookInput } from './return-outlook.types';

export const returnOutlook = ({ nextExpectedAt, now, soonDays }: ReturnOutlookInput): ReturnOutlook => {
  if (nextExpectedAt === null) {
    return { state: 'unknown', days: null };
  }

  const days = differenceInCalendarDays(new Date(nextExpectedAt), now);

  if (days < 0) {
    return { state: 'overdue', days: -days };
  }

  return { state: days <= soonDays ? 'soon' : 'later', days };
};
