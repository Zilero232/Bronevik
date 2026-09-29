import type { Prisma } from '../../../../../generated';
import type { BLOG_POST_INCLUDE } from './blog-post';

export type BlogPostRow = Prisma.BlogPostGetPayload<{ include: typeof BLOG_POST_INCLUDE }>;
