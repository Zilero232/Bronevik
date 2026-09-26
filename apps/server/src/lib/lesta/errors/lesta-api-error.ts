import type { LestaApiErrorInput, LestaHttpErrorInput, LestaNetworkErrorInput } from './errors.types';

import { errorMessage } from '../../../common/lib/errors';
import { RETRYABLE_HTTP_STATUS, RETRYABLE_LESTA_CODES } from './errors.constants';

export class LestaApiError extends Error {
  readonly code: string;
  readonly method: string;
  readonly status: number | undefined;
  readonly field: string | null;
  readonly value: string | null;

  constructor({ code, message, method, status, field, value }: LestaApiErrorInput) {
    super(`Lesta API ${method} failed: ${message ?? code}${field ? ` (field: ${field}, value: ${value ?? ''})` : ''}`);
    this.name = 'LestaApiError';
    this.code = code;
    this.method = method;
    this.status = status;
    this.field = field ?? null;
    this.value = value ?? null;
  }
}

export class LestaHttpError extends Error {
  readonly method: string;
  readonly status: number;
  readonly body: string | undefined;

  constructor({ method, status, body }: LestaHttpErrorInput) {
    super(`Lesta API ${method} responded with HTTP ${status}`);
    this.name = 'LestaHttpError';
    this.method = method;
    this.status = status;
    this.body = body;
  }
}

export class LestaNetworkError extends Error {
  readonly method: string;

  constructor({ method, cause }: LestaNetworkErrorInput) {
    super(`Lesta API ${method} network failure: ${errorMessage(cause)}`, { cause });
    this.name = 'LestaNetworkError';
    this.method = method;
  }
}

export const isRetryableLestaError = (error: unknown): boolean => {
  if (error instanceof LestaApiError) {
    return RETRYABLE_LESTA_CODES.has(error.code);
  }

  if (error instanceof LestaHttpError) {
    return error.status === RETRYABLE_HTTP_STATUS.tooManyRequests || error.status >= RETRYABLE_HTTP_STATUS.serverErrorFrom;
  }

  return error instanceof LestaNetworkError;
};
