import type { ApiErrorDetails } from '@otmetki/schemas';

export type AuthResult<T> = {
  data: T | null;
  error: { status: number; message?: string } | null;
};

export type PlusRequiredCode = 'PLAN_LIMIT_REACHED' | 'SUBSCRIPTION_REQUIRED';

export type PlusRequiredErrorInput = {
  code: PlusRequiredCode;
  details: ApiErrorDetails;
  message: string;
};
