import type { YooKassaPayment } from './yookassa.types';

import { YOOKASSA } from '../../config';

export const describeCard = (method: YooKassaPayment['payment_method']): string | null => {
  if (!method) {
    return null;
  }

  if (method.card?.last4) {
    return [method.card.card_type, `•••• ${method.card.last4}`].filter(Boolean).join(' ');
  }

  return method.title ?? null;
};

export const toAmount = (rub: number) => ({ value: rub.toFixed(2), currency: YOOKASSA.currency });
