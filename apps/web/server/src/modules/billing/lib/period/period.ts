import { addDays, addMonths, max, subMonths } from 'date-fns';

import type { AutoRenewInput, ExtendPeriodInput, IsPeriodActiveInput, RenewalKeyInput, RevokedPeriod, RevokePeriodInput } from './period.types';

export const extendPeriod = ({ currentPeriodEnd, now, months = 0, days = 0 }: ExtendPeriodInput): Date => {
  const base = currentPeriodEnd ? max([currentPeriodEnd, now]) : now;

  return addDays(addMonths(base, months), days);
};

export const revokePeriod = ({ currentPeriodEnd, now, months }: RevokePeriodInput): RevokedPeriod => {
  const end = subMonths(currentPeriodEnd, months);

  return { currentPeriodEnd: end, isExpired: end <= now };
};

export const isPeriodActive = ({ currentPeriodEnd, now }: IsPeriodActiveInput): boolean => currentPeriodEnd !== null && currentPeriodEnd > now;

export const cancelsAtPeriodEnd = ({ isRecurringEnabled, hasMethod, wasCancelled }: AutoRenewInput): boolean =>
  !isRecurringEnabled || !hasMethod || wasCancelled;

export const renewalIdempotenceKey = ({ subscriptionId, currentPeriodEnd }: RenewalKeyInput): string =>
  `renew-${subscriptionId}-${currentPeriodEnd.toISOString()}`;
