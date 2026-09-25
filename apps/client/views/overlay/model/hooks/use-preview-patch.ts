'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { decodePreviewConfig, OVERLAY_PREVIEW } from '@/entities/streamer/overlay';

export const usePreviewPatch = () => {
  const [preview] = useQueryState(OVERLAY_PREVIEW.param, parseAsString);

  return decodePreviewConfig(preview);
};
