import type { BillingStatus } from '@otmetki/schemas';

export type RenewalInput = Pick<BillingStatus, 'cancelAtPeriodEnd' | 'card' | 'currentPeriodEnd' | 'isRecurringAvailable' | 'status'>;

export type PeriodEndKind = 'accessUntil' | 'ended' | 'renews';

export type AutoRenewState = 'off' | 'on' | 'unavailable';

export type PlanCtaInput = Pick<BillingStatus, 'isPlus' | 'status'>;

export type PlanCta = 'changePlan' | 'renew' | 'upgrade';
