import { convertFileSrc } from '@tauri-apps/api/core';

import type { PreviewSrcInput } from './preview-src.types';

export const previewPath = ({ previewsDir, file }: PreviewSrcInput): string | null => {
  if (!previewsDir || !file || file.includes('..')) {
    return null;
  }

  return `${previewsDir.replace(/[\\/]+$/, '')}\\${file.replaceAll('/', '\\')}`;
};

export const previewSrc = (input: PreviewSrcInput): string | null => {
  const path = previewPath(input);

  return path ? convertFileSrc(path) : null;
};
