import type { BillingStatus, PaymentHistory, Plans } from '@otmetki/schemas';
import { billingControllerHistory, billingControllerPlans, billingControllerStartTrial, billingControllerStatus } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getPlusPlans = (): Promise<Plans> => fromSdk(() => billingControllerPlans());

export const getBillingStatus = (): Promise<BillingStatus> => fromSdk(() => billingControllerStatus(SESSION_REQUEST));

export const getPaymentHistory = (): Promise<PaymentHistory> => fromSdk(() => billingControllerHistory(SESSION_REQUEST));

export const startPlusTrial = (): Promise<BillingStatus> => fromSdk(() => billingControllerStartTrial(SESSION_REQUEST));
