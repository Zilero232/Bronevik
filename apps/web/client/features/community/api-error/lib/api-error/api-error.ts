import type { ApiErrorCode } from '@otmetki/schemas';

import { apiErrorSchema } from '@otmetki/schemas';
import { isAxiosError } from 'axios';

import { isNotFoundError, isUnauthorizedError } from '@/shared/api/source';

import type { CommunityErrorCodeMap, CommunityErrorKind } from './api-error.types';

import { COMMUNITY_ERROR_KIND } from '../../config';

export const apiErrorCode = (error: unknown): ApiErrorCode | null => {
  if (!isAxiosError(error)) {
    return null;
  }

  const parsed = apiErrorSchema.safeParse(error.response?.data);

  return parsed.success ? parsed.data.code : null;
};

export const communityErrorKind = (error: unknown): CommunityErrorKind => {
  if (isUnauthorizedError(error)) {
    return 'unauthorized';
  }

  if (isNotFoundError(error)) {
    return 'notFound';
  }

  const code = apiErrorCode(error);

  const kinds: CommunityErrorCodeMap = COMMUNITY_ERROR_KIND;

  return code === null ? 'unknown' : (kinds[code] ?? 'unknown');
};
