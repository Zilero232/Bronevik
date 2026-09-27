import type { ApiErrorCode } from '@otmetki/schemas';

import { apiErrorCode, communityErrorKind } from '@/features/community/api-error';
import { isPlusRequiredError } from '@/shared/api/source';

import type { ReplayUploadErrorKind } from './upload-error.types';

import { REPLAY_UPLOAD_ERROR_KIND } from '../../config';

const KINDS: Partial<Record<ApiErrorCode, ReplayUploadErrorKind>> = REPLAY_UPLOAD_ERROR_KIND;

export const replayUploadErrorKind = (error: unknown): ReplayUploadErrorKind => {
  if (isPlusRequiredError(error)) {
    return 'plus';
  }

  const code = apiErrorCode(error);

  return (code === null ? undefined : KINDS[code]) ?? communityErrorKind(error);
};
