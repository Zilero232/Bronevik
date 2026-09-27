import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { isPromoRejection } from '../promo-rejection';

const axiosFailure = (status: number, data: unknown) =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    data,
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() }
  });

describe('isPromoRejection', () => {
  it('accepts a promo rejection code', () => {
    expect(isPromoRejection(axiosFailure(400, { error: 'Promo code rejected: expired', code: 'PROMO_EXPIRED' }))).toBe(true);
  });

  it('rejects an unrelated server error', () => {
    expect(isPromoRejection(axiosFailure(400, { error: 'YooKassa returned no confirmation URL', code: 'PAYMENT_FAILED' }))).toBe(false);
  });

  it('rejects a network error without a body', () => {
    expect(isPromoRejection(new Error('Network Error'))).toBe(false);
  });
});
