import type { CheckoutInput, CheckoutResult, ReferralInput } from '@otmetki/schemas';

import { billingControllerCreateCheckout, billingControllerRegisterReferral } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const createCheckout = (input: CheckoutInput): Promise<CheckoutResult> =>
  fromSdk(() => billingControllerCreateCheckout({ ...SESSION_REQUEST, body: input }));

export const registerReferral = async (input: ReferralInput): Promise<void> => {
  await fromSdk(() => billingControllerRegisterReferral({ ...SESSION_REQUEST, body: input }));
};
