import type { ApiErrorCode, ApiErrorDetails } from '@otmetki/schemas';

export type ErrorBodyInput = {
  code: ApiErrorCode;
  error: string;
  details?: ApiErrorDetails;
};

export type ErrorBody = {
  error: string;
  code: ApiErrorCode;
  details?: ApiErrorDetails;
};
