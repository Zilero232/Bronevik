import type { BillingStatus, PromoRedeemInput } from '@otmetki/schemas';

import { billingControllerCancelAutoRenew, billingControllerRedeemPromo, billingControllerResumeAutoRenew } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const cancelAutoRenew = (): Promise<BillingStatus> => fromSdk(() => billingControllerCancelAutoRenew(SESSION_REQUEST));

export const resumeAutoRenew = (): Promise<BillingStatus> => fromSdk(() => billingControllerResumeAutoRenew(SESSION_REQUEST));

export const redeemPromo = (input: PromoRedeemInput): Promise<BillingStatus> =>
  fromSdk(() => billingControllerRedeemPromo({ ...SESSION_REQUEST, body: input }));
