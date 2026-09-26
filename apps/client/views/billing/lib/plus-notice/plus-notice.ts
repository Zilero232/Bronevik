import { daysUntil } from '@/shared/lib';

import type { PlusNotice, PlusNoticeInput } from './plus-notice.types';

export const plusNotice = ({ plus, now }: PlusNoticeInput): PlusNotice | null => {
  if (plus.state === 'grace' && plus.graceEndsAt) {
    return { kind: 'grace', until: plus.graceEndsAt };
  }

  if (plus.state === 'trial' && plus.periodEnd) {
    return { kind: 'trial', daysLeft: Math.max(0, daysUntil({ date: plus.periodEnd, now })) };
  }

  return null;
};
