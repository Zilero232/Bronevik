import type { PreviewLook } from './preview-look.types';

import { PREVIEW } from '../../config';

const isPreviewCategory = (category: string): category is keyof typeof PREVIEW.categories => Object.hasOwn(PREVIEW.categories, category);

export const previewLook = (category: string): PreviewLook => (isPreviewCategory(category) ? PREVIEW.categories[category] : PREVIEW.fallback);
