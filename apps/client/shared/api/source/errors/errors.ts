import type { ApiErrorDetails } from '@otmetki/schemas';

import type { PlusRequiredCode, PlusRequiredErrorInput } from './errors.types';

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class PlusRequiredError extends Error {
  readonly code: PlusRequiredCode;
  readonly details: ApiErrorDetails;

  constructor({ code, details, message }: PlusRequiredErrorInput) {
    super(message);
    this.name = 'PlusRequiredError';
    this.code = code;
    this.details = details;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
