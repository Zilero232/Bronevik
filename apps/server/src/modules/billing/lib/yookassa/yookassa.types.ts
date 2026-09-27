import type { z } from 'zod';

import type { CheckoutInput } from '../../billing.types';
import type { yookassaPaymentSchema, yookassaWebhookSchema } from './yookassa.schemas';

export type YooKassaPayment = z.infer<typeof yookassaPaymentSchema>;
export type YooKassaWebhook = z.infer<typeof yookassaWebhookSchema>;

export type YooKassaCredentials = {
  shopId: string;
  secretKey: string;
};

export type CreatePaymentInput = {
  amountRub: number;
  description: string;
  returnUrl: string;
  idempotenceKey: string;
  savePaymentMethod: boolean;
  metadata: Record<string, string>;
};

export type ChargeSavedMethodInput = {
  amountRub: number;
  description: string;
  paymentMethodId: string;
  idempotenceKey: string;
  metadata: Record<string, string>;
};

export type YooKassaRequestInput = {
  path: string;
  method: 'get' | 'post';
  json?: unknown;
  idempotenceKey?: string;
};

export type CheckoutKeyInput = Pick<CheckoutInput, 'plan' | 'promoCode' | 'userId'> & {
  now: Date;
};
