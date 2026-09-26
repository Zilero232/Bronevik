import { addDays, addMonths, max } from 'date-fns';

import type { AutoRenewInput, ExtendPeriodInput, IsPeriodActiveInput, RenewalKeyInput } from './period.types';

export const extendPeriod = ({ currentPeriodEnd, now, months = 0, days = 0 }: ExtendPeriodInput): Date => {
  const base = currentPeriodEnd ? max([currentPeriodEnd, now]) : now;

  return addDays(addMonths(base, months), days);
};

export const isPeriodActive = ({ currentPeriodEnd, now }: IsPeriodActiveInput): boolean => currentPeriodEnd !== null && currentPeriodEnd > now;

export const cancelsAtPeriodEnd = ({ isRecurringEnabled, hasMethod, wasCancelled }: AutoRenewInput): boolean =>
  !isRecurringEnabled || !hasMethod || wasCancelled;

export const renewalIdempotenceKey = ({ subscriptionId, currentPeriodEnd }: RenewalKeyInput): string =>
  `renew-${subscriptionId}-${currentPeriodEnd.toISOString()}`;
