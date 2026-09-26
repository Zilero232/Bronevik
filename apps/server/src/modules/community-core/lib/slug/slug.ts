import slugify from '@sindresorhus/slugify';

import type { TitleSlugInput } from './slug.types';

export const titleSlug = ({ title, suffix }: TitleSlugInput): string => `${slugify(title).slice(0, 80) || 'guide'}-${suffix}`;
