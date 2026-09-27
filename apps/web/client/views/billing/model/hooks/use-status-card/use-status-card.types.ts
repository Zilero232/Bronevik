import type { BillingStatus } from '@otmetki/schemas';

export type UseStatusCardInput = {
  status: BillingStatus;
};

export type AutoRenewMode = 'cancel' | 'resume';
