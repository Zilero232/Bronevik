import type { ApiError } from '@otmetki/schemas';

export type ErrorBodyInput = Pick<ApiError, 'code' | 'details' | 'error'>;

export type ErrorBody = Pick<ApiError, 'code' | 'details' | 'error'>;
