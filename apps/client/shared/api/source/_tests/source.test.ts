import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { fromServer, isNotFoundError, isUnauthorizedError } from '../source';

const httpError = (status: number) =>
  new AxiosError('failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: null
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

  it('resolves with what the server answered', async () => {
    await expect(fromServer(() => Promise.resolve(2))).resolves.toBe(2);
  });
});
