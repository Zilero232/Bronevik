import type { ApiErrorCode } from '@otmetki/schemas';

export type ErrorBodyInput = {
  code: ApiErrorCode;
  error: string;
};

export type ErrorBody = {
  error: string;
  code: ApiErrorCode;
};
