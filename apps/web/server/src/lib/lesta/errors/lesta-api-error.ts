import type { LestaApiErrorInput, LestaHttpErrorInput, LestaNetworkErrorInput, LestaQueueFullErrorInput } from './errors.types';

import { errorMessage } from '../../../common/lib';
import { EXTRA_REJECTION, RETRYABLE_HTTP_STATUS, RETRYABLE_LESTA_CODES } from './errors.constants';

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

export class LestaQueueFullError extends Error {
  readonly key: string;

  constructor({ key, cause }: LestaQueueFullErrorInput) {
    super(`Lesta rate limiter queue ${key} is full`, { cause });
    this.name = 'LestaQueueFullError';
    this.key = key;
  }
}

export const isRetryableLestaError = (error: unknown): boolean => {
  if (error instanceof LestaApiError) {
    return RETRYABLE_LESTA_CODES.has(error.code);
  }

  if (error instanceof LestaHttpError) {
    return error.status === RETRYABLE_HTTP_STATUS.tooManyRequests || error.status >= RETRYABLE_HTTP_STATUS.serverErrorFrom;
  }

  return error instanceof LestaNetworkError || error instanceof LestaQueueFullError;
};

export const isExtraRejected = (error: unknown): boolean =>
  error instanceof LestaApiError && (error.field === EXTRA_REJECTION.field || EXTRA_REJECTION.codePattern.test(error.code));
