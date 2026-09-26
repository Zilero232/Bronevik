'use client';

import { overlayPublicIdSchema } from '@otmetki/schemas';

import type { UseOverlayPageInput } from './use-overlay-page.types';

import { useOverlayFeed } from '../use-overlay-feed';
import { usePreviewPatch } from '../use-preview-patch';

export const useOverlayPage = ({ publicId }: UseOverlayPageInput) => {
  const isValid = overlayPublicIdSchema.safeParse(publicId).success;
  const patch = usePreviewPatch();
  const { data, isError } = useOverlayFeed({ publicId, isEnabled: isValid });

  return { patch, data, isError, isValid };
};
