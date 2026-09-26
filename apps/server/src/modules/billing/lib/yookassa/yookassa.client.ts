import type { ChargeSavedMethodInput, CreatePaymentInput, YooKassaCredentials, YooKassaPayment, YooKassaRequestInput } from './yookassa.types';

import { AppBadRequestException } from '../../../../common/exceptions';
import { errorMessage } from '../../../../common/lib';
import { http } from '../../../../lib/http';
import { YOOKASSA } from '../../config';
import { toAmount } from './yookassa.helpers';
import { yookassaPaymentSchema } from './yookassa.schemas';

export class YooKassaClient {
  constructor(private readonly credentials: YooKassaCredentials) {}

  get isConfigured(): boolean {
    return Boolean(this.credentials.shopId && this.credentials.secretKey);
  }

  createPayment({ amountRub, description, returnUrl, idempotenceKey, savePaymentMethod, metadata }: CreatePaymentInput): Promise<YooKassaPayment> {
    return this.request({
      path: '/payments',
      method: 'post',
      idempotenceKey,
      json: {
        amount: toAmount(amountRub),
        capture: true,
        description,
        metadata,
        save_payment_method: savePaymentMethod,
        confirmation: { type: 'redirect', return_url: returnUrl }
      }
    });
  }

  chargeSavedMethod({ amountRub, description, paymentMethodId, idempotenceKey, metadata }: ChargeSavedMethodInput): Promise<YooKassaPayment> {
    return this.request({
      path: '/payments',
      method: 'post',
      idempotenceKey,
      json: { amount: toAmount(amountRub), capture: true, description, metadata, payment_method_id: paymentMethodId }
    });
  }

  getPayment(paymentId: string): Promise<YooKassaPayment> {
    return this.request({ path: `/payments/${encodeURIComponent(paymentId)}`, method: 'get' });
  }

  private async request({ path, method, json, idempotenceKey }: YooKassaRequestInput): Promise<YooKassaPayment> {
    if (!this.isConfigured) {
      throw new AppBadRequestException('PAYMENT_FAILED', 'Payments are not configured');
    }

    const authorization = `Basic ${Buffer.from(`${this.credentials.shopId}:${this.credentials.secretKey}`).toString('base64')}`;

    try {
      const body = await http(`${YOOKASSA.apiUrl}${path}`, {
        method,
        json,
        timeout: YOOKASSA.timeoutMs,
        headers: { authorization, ...(idempotenceKey ? { 'idempotence-key': idempotenceKey } : {}) }
      }).json();

      return yookassaPaymentSchema.parse(body);
    } catch (error) {
      throw new AppBadRequestException('PAYMENT_FAILED', `YooKassa ${method.toUpperCase()} ${path} failed: ${errorMessage(error)}`);
    }
  }
}
