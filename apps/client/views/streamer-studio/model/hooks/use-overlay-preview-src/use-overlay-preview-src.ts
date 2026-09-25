'use client';

import { useDebounceValue } from '@siberiacancode/reactuse';

import { encodePreviewConfig, OVERLAY_PREVIEW } from '@/entities/streamer/overlay';
import { ROUTES } from '@/shared/constants';

import type { UseOverlayPreviewSrcInput } from './use-overlay-preview-src.types';

import { OVERLAY_EDITOR } from '../../../config';

export const useOverlayPreviewSrc = ({ publicId, config }: UseOverlayPreviewSrcInput) => {
  const encoded = useDebounceValue(encodePreviewConfig(config), OVERLAY_EDITOR.previewDebounceMs);

  return publicId ? `${ROUTES.overlay(publicId)}?${new URLSearchParams({ [OVERLAY_PREVIEW.param]: encoded }).toString()}` : null;
};
