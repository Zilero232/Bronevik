import { convertFileSrc } from '@tauri-apps/api/core';

import type { PreviewSrcInput } from './preview-src.types';

export const previewPath = ({ previewsDir, image }: PreviewSrcInput): string | null => {
  if (!previewsDir || !image || image.includes('..')) {
    return null;
  }

  return `${previewsDir.replace(/[\\/]+$/, '')}\\${image.replaceAll('/', '\\')}`;
};

export const previewSrc = (input: PreviewSrcInput): string | null => {
  const path = previewPath(input);

  return path ? convertFileSrc(path) : null;
};
