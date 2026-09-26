import type { ApiErrorCode } from '@otmetki/schemas';

export type CommunityErrorKind = 'conflict' | 'forbidden' | 'notFound' | 'rateLimited' | 'unauthorized' | 'unknown' | 'validation';

export type CommunityErrorCodeMap = Partial<Record<ApiErrorCode, CommunityErrorKind>>;
