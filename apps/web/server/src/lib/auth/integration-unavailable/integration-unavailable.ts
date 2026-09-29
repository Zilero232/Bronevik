import type { ApiErrorCode } from '@otmetki/schemas';

import { APIError } from 'better-auth/api';

export const integrationUnavailable = (message: string): APIError =>
  APIError.from('NOT_FOUND', { code: 'INTEGRATION_UNAVAILABLE' satisfies ApiErrorCode, message });
