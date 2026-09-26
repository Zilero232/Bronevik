import type { SubscriptionStatus } from '@otmetki/schemas';

const renewableStatuses: readonly SubscriptionStatus[] = ['trialing', 'active', 'pastDue'];

export const RENEWAL = {
  renewableStatuses
} as const;
