import { differenceInCalendarDays } from 'date-fns';

import type { PlusNotice, PlusNoticeInput } from './plus-notice.types';

export const plusNotice = ({ plus, now }: PlusNoticeInput): PlusNotice | null => {
  if (plus.state === 'grace' && plus.graceEndsAt) {
    return { kind: 'grace', until: plus.graceEndsAt };
  }

  if (plus.state === 'trial' && plus.periodEnd) {
    return { kind: 'trial', daysLeft: Math.max(0, differenceInCalendarDays(new Date(plus.periodEnd), now)) };
  }

  return null;
};
