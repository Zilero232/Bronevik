import type { AutoRenewState, PeriodEndKind, PlanCta, PlanCtaInput, RenewalInput } from './renewal.types';

import { RENEWAL } from '../../config';

export const autoRenewState = ({ status, cancelAtPeriodEnd, isRecurringAvailable }: RenewalInput): AutoRenewState => {
  if (!isRecurringAvailable || !status || !RENEWAL.renewableStatuses.includes(status)) {
    return 'unavailable';
  }

  return cancelAtPeriodEnd ? 'off' : 'on';
};

export const periodEndKind = (input: RenewalInput): PeriodEndKind | null => {
  if (!input.currentPeriodEnd || !input.status) {
    return null;
  }

  if (input.status === 'expired') {
    return 'ended';
  }

  return autoRenewState(input) === 'on' ? 'renews' : 'accessUntil';
};

export const planCta = ({ isPlus, status }: PlanCtaInput): PlanCta => {
  if (isPlus) {
    return 'changePlan';
  }

  return status ? 'renew' : 'upgrade';
};
