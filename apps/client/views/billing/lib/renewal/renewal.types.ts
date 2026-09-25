import type { BillingStatus } from '@bronevik/schemas';

export type RenewalInput = Pick<BillingStatus, 'cancelAtPeriodEnd' | 'currentPeriodEnd' | 'isRecurringAvailable' | 'status'>;

export type PeriodEndKind = 'accessUntil' | 'ended' | 'renews';

export type AutoRenewState = 'off' | 'on' | 'unavailable';

export type PlanCtaInput = Pick<BillingStatus, 'isPlus' | 'status'>;

export type PlanCta = 'changePlan' | 'renew' | 'upgrade';
