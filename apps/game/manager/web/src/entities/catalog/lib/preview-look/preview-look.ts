import type { PreviewLook } from './preview-look.types';

import { PREVIEW } from '../../config';

export const previewLook = (category: string): PreviewLook =>
  Object.hasOwn(PREVIEW.categories, category) ? PREVIEW.categories[category as keyof typeof PREVIEW.categories] : PREVIEW.fallback;
