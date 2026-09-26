import type { SubscriptionStatus } from '@bronevik/schemas';

const renewableStatuses: readonly SubscriptionStatus[] = ['trialing', 'active', 'pastDue'];

export const RENEWAL = {
  renewableStatuses
} as const;
