import type { BillingStatus, CheckoutInput, CheckoutResult, PaymentHistory, Plans, PromoRedeemInput, ReferralInput } from '@bronevik/schemas';

import {
  billingControllerCancelAutoRenew,
  billingControllerCreateCheckout,
  billingControllerHistory,
  billingControllerPlans,
  billingControllerRedeemPromo,
  billingControllerRegisterReferral,
  billingControllerResumeAutoRenew,
  billingControllerStatus
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const getPlusPlans = (): Promise<Plans> => fromSdk(() => billingControllerPlans());

export const getBillingStatus = (): Promise<BillingStatus> => fromSdk(() => billingControllerStatus(SESSION_REQUEST));

export const getPaymentHistory = (): Promise<PaymentHistory> => fromSdk(() => billingControllerHistory(SESSION_REQUEST));

export const createCheckout = (input: CheckoutInput): Promise<CheckoutResult> =>
  fromSdk(() => billingControllerCreateCheckout({ ...SESSION_REQUEST, body: input }));

export const cancelAutoRenew = (): Promise<BillingStatus> => fromSdk(() => billingControllerCancelAutoRenew(SESSION_REQUEST));

export const resumeAutoRenew = (): Promise<BillingStatus> => fromSdk(() => billingControllerResumeAutoRenew(SESSION_REQUEST));

export const redeemPromo = (input: PromoRedeemInput): Promise<BillingStatus> =>
  fromSdk(() => billingControllerRedeemPromo({ ...SESSION_REQUEST, body: input }));

export const registerReferral = async (input: ReferralInput): Promise<void> => {
  await fromSdk(() => billingControllerRegisterReferral({ ...SESSION_REQUEST, body: input }));
};
