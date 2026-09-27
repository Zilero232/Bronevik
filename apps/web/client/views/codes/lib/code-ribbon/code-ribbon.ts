import { differenceInCalendarDays } from 'date-fns';

import type { CodeRibbon, CodeRibbonInput, ExpiringCountInput } from './code-ribbon.types';

const daysLeft = ({ expiresAt, now }: { expiresAt: string | null; now: Date }) =>
  expiresAt === null ? null : differenceInCalendarDays(new Date(expiresAt), now);

export const codeRibbon = ({ code, now, expiringDays, freshDays }: CodeRibbonInput): CodeRibbon | null => {
  if (now === null || code.status === 'expired') {
    return null;
  }

  const days = daysLeft({ expiresAt: code.expiresAt, now });

  if (days !== null && days >= 0 && days <= expiringDays) {
    return { kind: 'expiring', days };
  }

  if (differenceInCalendarDays(now, new Date(code.discoveredAt)) <= freshDays) {
    return { kind: 'new' };
  }

  return null;
};

export const expiringCount = ({ codes, now, expiringDays }: ExpiringCountInput) => {
  if (now === null) {
    return null;
  }

  return codes.filter((code) => {
    const days = daysLeft({ expiresAt: code.expiresAt, now });

    return code.status !== 'expired' && days !== null && days >= 0 && days <= expiringDays;
  }).length;
};
