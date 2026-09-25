import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { isNotFoundError, isUnauthorizedError } from '../source';

const flags = vi.hoisted(() => ({ useMocks: false }));

vi.mock('@/shared/config/client-env', () => ({
  env: {
    get NEXT_PUBLIC_USE_MOCKS() {
      return flags.useMocks;
    }
  }
}));

const httpError = (status: number) =>
  new AxiosError('failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: null
  });

const { fromSource } = await import('../source');

describe('fromSource', () => {
  it('turns a 404 from the API into a not-found error the pages can branch on', async () => {
    flags.useMocks = false;

    await expect(fromSource({ mock: () => 1, fetch: () => Promise.reject(httpError(404)) })).rejects.toSatisfy(isNotFoundError);
  });

  it('turns a 401 into an unauthorized error', async () => {
    flags.useMocks = false;

    await expect(fromSource({ mock: () => 1, fetch: () => Promise.reject(httpError(401)) })).rejects.toSatisfy(isUnauthorizedError);
  });

  it('passes other failures through untouched', async () => {
    flags.useMocks = false;

    const failure = httpError(500);

    await expect(fromSource({ mock: () => 1, fetch: () => Promise.reject(failure) })).rejects.toBe(failure);
  });

  it('answers from the mock without touching the network when mocks are on', async () => {
    flags.useMocks = true;

    const fetch = vi.fn(() => Promise.resolve(2));

    await expect(fromSource({ mock: () => 1, fetch })).resolves.toBe(1);
    expect(fetch).not.toHaveBeenCalled();
  });
});
