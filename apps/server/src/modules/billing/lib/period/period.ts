import { addDays, addMonths, max } from 'date-fns';
import { isIncludedIn } from 'remeda';

import type { AutoRenewInput, ExtendPeriodInput, IsEntitledInput, IsPeriodActiveInput, RenewalKeyInput } from './period.types';

import { PLUS_SUBSCRIPTION } from '../../config';

export const extendPeriod = ({ currentPeriodEnd, now, months = 0, days = 0 }: ExtendPeriodInput): Date => {
  const base = currentPeriodEnd ? max([currentPeriodEnd, now]) : now;

  return addDays(addMonths(base, months), days);
};

export const isPeriodActive = ({ currentPeriodEnd, now }: IsPeriodActiveInput): boolean => currentPeriodEnd !== null && currentPeriodEnd > now;

export const cancelsAtPeriodEnd = ({ isRecurringEnabled, hasMethod, wasCancelled }: AutoRenewInput): boolean =>
  !isRecurringEnabled || !hasMethod || wasCancelled;

export const renewalIdempotenceKey = ({ subscriptionId, currentPeriodEnd }: RenewalKeyInput): string =>
  `renew-${subscriptionId}-${currentPeriodEnd.toISOString()}`;

export const isEntitled = ({ subscription, now }: IsEntitledInput): boolean =>
  subscription !== null &&
  isIncludedIn(subscription.status, PLUS_SUBSCRIPTION.entitledStatuses) &&
  isPeriodActive({ currentPeriodEnd: subscription.currentPeriodEnd, now });
