import type { PaymentStatus, SubscriptionStatus } from '@bronevik/schemas';

import type { BadgeTone } from '@/ui-kit';

import { BILLING_TONES } from '../../config';

export const subscriptionTone = (status: SubscriptionStatus | null): BadgeTone => (status ? BILLING_TONES.subscription[status] : BILLING_TONES.none);

export const paymentTone = (status: PaymentStatus): BadgeTone => BILLING_TONES.payment[status];
