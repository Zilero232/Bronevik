import type { CommunityErrorCodeMap } from '../lib/api-error';

export const COMMUNITY_ERROR_KIND = {
  VALIDATION_FAILED: 'validation',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'notFound',
  CONFLICT: 'conflict',
  RATE_LIMITED: 'rateLimited'
} as const satisfies CommunityErrorCodeMap;
