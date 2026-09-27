import type { Payment } from '../../../../../generated';
import type { PaymentHistoryItem } from '../../billing.types';

import { toIso } from '../../../../common/lib';

export const toPaymentHistoryItem = (payment: Payment): PaymentHistoryItem => ({
  id: payment.id,
  amount: payment.amount.toNumber(),
  currency: payment.currency,
  status: payment.status,
  plan: payment.plan,
  isAutoCharge: payment.isAutoCharge,
  promoCode: payment.promoCode,
  createdAt: payment.createdAt.toISOString(),
  paidAt: toIso(payment.paidAt)
});
