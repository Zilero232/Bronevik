import type { BillingStatus, CheckoutInput, CheckoutResult, PaymentHistory, Plans, PromoRedeemInput, ReferralInput } from '@bronevik/schemas';

import { billingStatusSchema, checkoutResultSchema, paymentHistorySchema, plansSchema } from '@bronevik/schemas';

import { api } from '../http';
import { fromSource } from '../source';
import { BILLING_PATHS } from './billing.constants';
import { mockBilling } from './mock/billing.mock';

const WITH_SESSION = { withCredentials: true } as const;

export const getPlusPlans = (): Promise<Plans> =>
  fromSource({
    mock: () => plansSchema.parse(mockBilling.plans()),
    fetch: async () => plansSchema.parse((await api.get(BILLING_PATHS.plans)).data)
  });

export const getBillingStatus = (): Promise<BillingStatus> =>
  fromSource({
    mock: () => billingStatusSchema.parse(mockBilling.status()),
    fetch: async () => billingStatusSchema.parse((await api.get(BILLING_PATHS.status, WITH_SESSION)).data)
  });

export const getPaymentHistory = (): Promise<PaymentHistory> =>
  fromSource({
    mock: () => paymentHistorySchema.parse(mockBilling.history()),
    fetch: async () => paymentHistorySchema.parse((await api.get(BILLING_PATHS.history, WITH_SESSION)).data)
  });

export const createCheckout = (input: CheckoutInput): Promise<CheckoutResult> =>
  fromSource({
    mock: () => checkoutResultSchema.parse(mockBilling.checkout(input)),
    fetch: async () => checkoutResultSchema.parse((await api.post(BILLING_PATHS.checkout, input, WITH_SESSION)).data)
  });

export const cancelAutoRenew = (): Promise<BillingStatus> =>
  fromSource({
    mock: () => billingStatusSchema.parse(mockBilling.setAutoRenew(false)),
    fetch: async () => billingStatusSchema.parse((await api.post(BILLING_PATHS.cancel, {}, WITH_SESSION)).data)
  });

export const resumeAutoRenew = (): Promise<BillingStatus> =>
  fromSource({
    mock: () => billingStatusSchema.parse(mockBilling.setAutoRenew(true)),
    fetch: async () => billingStatusSchema.parse((await api.post(BILLING_PATHS.resume, {}, WITH_SESSION)).data)
  });

export const redeemPromo = (input: PromoRedeemInput): Promise<BillingStatus> =>
  fromSource({
    mock: () => billingStatusSchema.parse(mockBilling.redeemPromo(input)),
    fetch: async () => billingStatusSchema.parse((await api.post(BILLING_PATHS.promo, input, WITH_SESSION)).data)
  });

export const registerReferral = (input: ReferralInput): Promise<void> =>
  fromSource({
    mock: () => undefined,
    fetch: async () => {
      await api.post(BILLING_PATHS.referral, input, WITH_SESSION);
    }
  });
