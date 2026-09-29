import { AUTHOR_SELECT } from '../../../community-core';

export const BLOG_POST_INCLUDE = { author: { select: AUTHOR_SELECT } } as const;
