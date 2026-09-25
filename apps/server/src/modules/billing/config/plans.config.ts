import type { SubscriptionStatus } from '../../../../generated';

export const PLUS_PLANS = {
  monthly: { plan: 'monthly', months: 1, priceRub: 199 },
  yearly: { plan: 'yearly', months: 12, priceRub: 1_990 }
} as const;

export const PLUS_PRODUCT = 'plus';

export const ENTITLED_STATUSES: readonly SubscriptionStatus[] = ['active', 'trialing', 'pastDue'];

export const PAYMENT_DESCRIPTION = {
  purchase: 'Броневик Плюс: {months} мес.',
  renewal: 'Продление Броневик Плюс: {months} мес.'
} as const;

export const BILLING_LINKS = {
  returnPath: '/me?billing=return'
} as const;

export const REFERRAL = {
  bonusDays: 30
} as const;

export const PRICING = {
  minPriceRub: 1
} as const;
