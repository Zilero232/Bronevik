import type { PaymentStatus, SubscriptionStatus } from '@bronevik/schemas';

import type { BadgeTone } from '@/ui-kit';

export const BILLING_TONES = {
  subscription: {
    trialing: 'steel',
    active: 'success',
    pastDue: 'warning',
    canceled: 'neutral',
    expired: 'danger'
  },
  payment: {
    pending: 'warning',
    waitingForCapture: 'warning',
    succeeded: 'success',
    canceled: 'neutral',
    refunded: 'steel'
  },
  none: 'neutral'
} as const satisfies {
  subscription: Record<SubscriptionStatus, BadgeTone>;
  payment: Record<PaymentStatus, BadgeTone>;
  none: BadgeTone;
};
