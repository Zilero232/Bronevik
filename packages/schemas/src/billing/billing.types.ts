import type { z } from 'zod';

import type {
  billingStatusSchema,
  checkoutResultSchema,
  checkoutSchema,
  paymentHistoryItemSchema,
  paymentHistorySchema,
  paymentStatusSchema,
  planOfferSchema,
  plansSchema,
  plusPlanSchema,
  promoRedeemSchema,
  referralSchema,
  subscriptionPlanSchema,
  subscriptionStatusSchema
} from './billing.schemas';

export type PlusPlan = z.infer<typeof plusPlanSchema>;
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PlanOffer = z.infer<typeof planOfferSchema>;
export type Plans = z.infer<typeof plansSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutResult = z.infer<typeof checkoutResultSchema>;
export type BillingStatus = z.infer<typeof billingStatusSchema>;
export type PaymentHistoryItem = z.infer<typeof paymentHistoryItemSchema>;
export type PaymentHistory = z.infer<typeof paymentHistorySchema>;
export type PromoRedeemInput = z.infer<typeof promoRedeemSchema>;
export type ReferralInput = z.infer<typeof referralSchema>;
