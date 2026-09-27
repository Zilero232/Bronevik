import { describe, expect, it, vi } from 'vitest';

import type { YooKassaPayment } from '../yookassa.types';

import { AppBadRequestException } from '../../../../../common/exceptions';
import { YOOKASSA } from '../../../config';
import { YooKassaClient } from '../yookassa.client';

const credentials = { shopId: 'shop', secretKey: 'secret' };

const payment: YooKassaPayment = {
  id: 'pay-1',
  status: 'pending',
  amount: { value: '199.00', currency: YOOKASSA.currency },
  confirmation: { confirmation_url: 'https://yookassa.test/confirm' }
};

type Sent = {
  request: Request;
  body: unknown;
};

const reply = (body: unknown, status = 200) => {
  const sent: Sent[] = [];
  const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    if (input instanceof Request) {
      sent.push({ request: input, body: input.method === 'GET' ? null : await input.clone().json() });
    }

    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  });

  return { fetchSpy, sent };
};

const sentRequest = ({ sent }: ReturnType<typeof reply>): Sent => {
  const [first] = sent;

  if (!first) {
    throw new TypeError('expected ky to send a Request');
  }

  return first;
};

const purchase = {
  amountRub: 199,
  description: 'Plus',
  returnUrl: 'https://otmetki.test/me/billing',
  idempotenceKey: 'key-1',
  savePaymentMethod: true,
  metadata: { userId: 'u1' }
};

describe('YooKassaClient.isConfigured', () => {
  it.each([
    [{ shopId: 'shop', secretKey: 'secret' }, true],
    [{ shopId: '', secretKey: 'secret' }, false],
    [{ shopId: 'shop', secretKey: '' }, false]
  ])('needs both the shop id and the secret key (%o)', (input, expected) => {
    expect(new YooKassaClient(input).isConfigured).toBe(expected);
  });
});

describe('YooKassaClient.createPayment', () => {
  it('posts a redirect payment with basic auth and the idempotence key', async () => {
    const replied = reply(payment);

    await expect(new YooKassaClient(credentials).createPayment(purchase)).resolves.toEqual(payment);

    const { request, body } = sentRequest(replied);

    expect(request.url).toBe(`${YOOKASSA.apiUrl}/payments`);
    expect(request.method).toBe('POST');
    expect(request.headers.get('authorization')).toBe(`Basic ${Buffer.from('shop:secret').toString('base64')}`);
    expect(request.headers.get('idempotence-key')).toBe(purchase.idempotenceKey);

    expect(body).toEqual(
      expect.objectContaining({
        amount: { value: '199.00', currency: YOOKASSA.currency },
        capture: true,
        save_payment_method: true,
        confirmation: { type: 'redirect', return_url: purchase.returnUrl }
      })
    );
  });

  it('refuses without calling YooKassa when credentials are missing', async () => {
    const replied = reply(payment);

    await expect(new YooKassaClient({ shopId: '', secretKey: '' }).createPayment(purchase)).rejects.toMatchObject({
      response: { code: 'PAYMENT_FAILED' }
    });

    expect(replied.fetchSpy).not.toHaveBeenCalled();
  });
});

describe('YooKassaClient.chargeSavedMethod', () => {
  it('charges the saved payment method without a confirmation step', async () => {
    const replied = reply(payment);

    await new YooKassaClient(credentials).chargeSavedMethod({
      amountRub: 529,
      description: 'Renewal',
      paymentMethodId: 'card-1',
      idempotenceKey: 'renew-1',
      metadata: {}
    });

    const { request, body } = sentRequest(replied);

    expect(request.headers.get('idempotence-key')).toBe('renew-1');
    expect(body).toEqual(expect.objectContaining({ payment_method_id: 'card-1', amount: { value: '529.00', currency: YOOKASSA.currency } }));
    expect(body).not.toHaveProperty('confirmation');
  });
});

describe('YooKassaClient.getPayment', () => {
  it('reads a payment by its encoded id without an idempotence key', async () => {
    const replied = reply(payment);

    await new YooKassaClient(credentials).getPayment('a/b');

    const { request } = sentRequest(replied);

    expect(request.method).toBe('GET');
    expect(request.url).toBe(`${YOOKASSA.apiUrl}/payments/${encodeURIComponent('a/b')}`);
    expect(request.headers.has('idempotence-key')).toBe(false);
  });
});

describe('YooKassaClient errors', () => {
  it('turns an error response into a payment failure', async () => {
    reply({ type: 'error', code: 'invalid_request', description: 'Bad amount' }, 400);

    const failure = new YooKassaClient(credentials).getPayment('pay-1');

    await expect(failure).rejects.toBeInstanceOf(AppBadRequestException);
    await expect(failure).rejects.toMatchObject({ response: { code: 'PAYMENT_FAILED' } });
  });

  it('turns an unexpected body into a payment failure', async () => {
    reply({ id: 'pay-1', status: 'unknown' });

    await expect(new YooKassaClient(credentials).getPayment('pay-1')).rejects.toMatchObject({ response: { code: 'PAYMENT_FAILED' } });
  });

  it('turns a network error into a payment failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('fetch failed'));

    await expect(new YooKassaClient(credentials).getPayment('pay-1')).rejects.toBeInstanceOf(AppBadRequestException);
  });
});
