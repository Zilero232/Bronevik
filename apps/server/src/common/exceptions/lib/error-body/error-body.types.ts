import type { ApiErrorCode } from '@bronevik/schemas';

export type ErrorBodyInput = {
  code: ApiErrorCode;
  error: string;
};

export type ErrorBody = {
  error: string;
  code: ApiErrorCode;
};
