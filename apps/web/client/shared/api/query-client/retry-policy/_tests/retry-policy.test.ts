import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { NotFoundError, PlusRequiredError, UnauthorizedError } from '@/shared/api/source';

import { shouldRetryQuery } from '../retry-policy';
import { QUERY_RETRY } from '../retry-policy.constants';

const httpError = (status: number) =>
  new AxiosError('failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: null
  });

const retriesOf = (error: unknown) => {
  let failureCount = 0;

  while (shouldRetryQuery({ failureCount, error })) {
    failureCount += 1;
  }

  return failureCount;
};

describe('shouldRetryQuery', () => {
  it('gives up at once when the API answers that it is unavailable', () => {
    expect(retriesOf(httpError(503))).toBe(0);
  });

  it('gives up at once on an internal server error', () => {
    expect(retriesOf(httpError(500))).toBe(0);
  });

  it('never retries a client error, raw or normalised', () => {
    expect(retriesOf(httpError(400))).toBe(0);
    expect(retriesOf(httpError(404))).toBe(0);
    expect(retriesOf(new NotFoundError())).toBe(0);
    expect(retriesOf(new UnauthorizedError())).toBe(0);
    expect(retriesOf(new PlusRequiredError({ code: 'SUBSCRIPTION_REQUIRED', details: {}, message: 'plus' }))).toBe(0);
  });

  it('retries a gateway hiccup a limited number of times', () => {
    for (const status of QUERY_RETRY.gatewayStatuses) {
      expect(retriesOf(httpError(status))).toBe(QUERY_RETRY.gatewayAttempts);
    }
  });

  it('retries a dropped connection a limited number of times', () => {
    expect(retriesOf(new AxiosError('offline', AxiosError.ERR_NETWORK))).toBe(QUERY_RETRY.networkAttempts);
  });

  it('does not wait out another timeout after one already expired', () => {
    expect(retriesOf(new AxiosError('timeout', AxiosError.ECONNABORTED))).toBe(0);
  });

  it('does not retry a failure that is not a request error', () => {
    expect(retriesOf(new Error('parse failed'))).toBe(0);
  });
});
