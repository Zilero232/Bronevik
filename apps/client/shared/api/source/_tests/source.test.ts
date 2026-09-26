import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { fromServer, isNotFoundError, isPlusRequiredError, isUnauthorizedError } from '../source';

const httpError = (status: number, data: unknown = null) =>
  new AxiosError('failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data
  });

describe('fromServer', () => {
  it('turns a 404 from the API into a not-found error the pages can branch on', async () => {
    await expect(fromServer(() => Promise.reject(httpError(404)))).rejects.toSatisfy(isNotFoundError);
  });

  it('turns a 401 into an unauthorized error', async () => {
    await expect(fromServer(() => Promise.reject(httpError(401)))).rejects.toSatisfy(isUnauthorizedError);
  });

  it('passes other failures through untouched', async () => {
    const failure = httpError(500);

    await expect(fromServer(() => Promise.reject(failure))).rejects.toBe(failure);
  });

  it('turns a Plus refusal into an error that names the locked feature', async () => {
    const body = { error: 'analytics needs Plus', code: 'SUBSCRIPTION_REQUIRED', details: { feature: 'analytics' } };
    const failure = fromServer(() => Promise.reject(httpError(403, body)));

    await expect(failure).rejects.toSatisfy(isPlusRequiredError);
    await expect(failure).rejects.toMatchObject({ code: 'SUBSCRIPTION_REQUIRED', details: { feature: 'analytics' } });
  });

  it('keeps the limit a subscriber ran into', async () => {
    const body = { error: 'limit', code: 'PLAN_LIMIT_REACHED', details: { limitKey: 'goals', limit: 10 } };

    await expect(fromServer(() => Promise.reject(httpError(403, body)))).rejects.toMatchObject({ details: { limitKey: 'goals', limit: 10 } });
  });

  it('leaves an ordinary forbidden answer alone', async () => {
    const failure = httpError(403, { error: 'no', code: 'FORBIDDEN' });

    await expect(fromServer(() => Promise.reject(failure))).rejects.toBe(failure);
  });

  it('resolves with what the server answered', async () => {
    await expect(fromServer(() => Promise.resolve(2))).resolves.toBe(2);
  });
});
