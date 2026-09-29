import type { PREVIEW } from '../../config';

export type PreviewLook = (typeof PREVIEW)['categories'][keyof (typeof PREVIEW)['categories']] | (typeof PREVIEW)['fallback'];
