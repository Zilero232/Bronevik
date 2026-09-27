import { describe, expect, it } from 'vitest';

import { LESTA_ERROR_CODE, RETRYABLE_HTTP_STATUS } from '../errors.constants';
import { isRetryableLestaError, LestaApiError, LestaHttpError, LestaNetworkError, LestaQueueFullError } from '../lesta-api-error';

const METHOD = 'account/info';

describe('Lesta errors', () => {
  it('describes the failing field in the API error message', () => {
    const error = new LestaApiError({ code: LESTA_ERROR_CODE.invalidAccessToken, method: METHOD, status: 407, field: 'access_token', value: 'x' });

    expect(error.message).toContain(METHOD);
    expect(error.message).toContain('field: access_token, value: x');
    expect(error).toMatchObject({ name: 'LestaApiError', code: LESTA_ERROR_CODE.invalidAccessToken, status: 407 });
  });

  it('defaults a missing field and value to null', () => {
    const error = new LestaApiError({ code: LESTA_ERROR_CODE.methodNotFound, method: METHOD });

    expect(error.field).toBeNull();
    expect(error.value).toBeNull();
    expect(error.message).not.toContain('field:');
  });

  it('keeps the cause of a network failure', () => {
    const cause = new Error('socket hang up');
    const error = new LestaNetworkError({ method: METHOD, cause });

    expect(error.cause).toBe(cause);
    expect(error.message).toContain(cause.message);
    expect(new LestaNetworkError({ method: METHOD, cause: 'boom' }).message).toContain('boom');
  });

  it.each([
    [new LestaApiError({ code: LESTA_ERROR_CODE.requestLimitExceeded, method: METHOD }), true],
    [new LestaApiError({ code: LESTA_ERROR_CODE.sourceNotAvailable, method: METHOD }), true],
    [new LestaApiError({ code: LESTA_ERROR_CODE.invalidApplicationId, method: METHOD }), false],
    [new LestaHttpError({ method: METHOD, status: RETRYABLE_HTTP_STATUS.tooManyRequests }), true],
    [new LestaHttpError({ method: METHOD, status: RETRYABLE_HTTP_STATUS.serverErrorFrom }), true],
    [new LestaHttpError({ method: METHOD, status: RETRYABLE_HTTP_STATUS.serverErrorFrom - 1 }), false],
    [new LestaNetworkError({ method: METHOD, cause: null }), true],
    [new Error('other'), false]
  ])('classifies %o as retryable: %s', (error, expected) => {
    expect(isRetryableLestaError(error)).toBe(expected);
  });
});

describe('isRetryableLestaError queue overflow', () => {
  it('retries a request the local limiter queue had no room for', () => {
    expect(isRetryableLestaError(new LestaQueueFullError({ key: 'global', cause: new Error('full') }))).toBe(true);
  });
});
