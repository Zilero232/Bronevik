import type { BlogCategory } from '@/entities/blog/post';

import type { BLOG_PAGE } from '../../../config';

export type BlogCategoryFilter = BlogCategory | typeof BLOG_PAGE.allCategories;
