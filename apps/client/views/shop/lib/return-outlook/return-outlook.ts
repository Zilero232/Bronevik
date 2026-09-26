import { daysBetween } from '@/shared/lib';

import type { ReturnOutlook, ReturnOutlookInput } from './return-outlook.types';

export const returnOutlook = ({ nextExpectedAt, now, soonDays, timeZone }: ReturnOutlookInput): ReturnOutlook => {
  if (nextExpectedAt === null) {
    return { state: 'unknown', days: null };
  }

  const days = daysBetween({ from: now, to: nextExpectedAt, timeZone });

  if (days < 0) {
    return { state: 'overdue', days: -days };
  }

  return { state: days <= soonDays ? 'soon' : 'later', days };
};
