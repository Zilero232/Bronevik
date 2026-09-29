'use client';

import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';

import type { BlogCategory } from '@/entities/blog/post';

import { BLOG_CATEGORIES } from '@/entities/blog/post';

import type { BlogCategoryFilter } from './use-blog-filters.types';

import { BLOG_PAGE } from '../../../config';
import { toggledTag } from '../../../lib/blog-filters';

export const useBlogFilters = () => {
  const [category, setCategory] = useQueryState(
    'category',
    parseAsStringLiteral([BLOG_PAGE.allCategories, ...BLOG_CATEGORIES])
      .withDefault(BLOG_PAGE.allCategories)
      .withOptions({ history: 'replace' })
  );

  const [tag, setTag] = useQueryState('tag', parseAsString.withOptions({ history: 'replace' }));

  const selectedCategory: BlogCategory | undefined = category === BLOG_PAGE.allCategories ? undefined : category;

  return {
    category,
    tag,
    isFiltered: selectedCategory !== undefined || tag !== null,
    params: { ...(selectedCategory ? { category: selectedCategory } : {}), ...(tag ? { tag } : {}) },
    onCategoryChange: (next: BlogCategoryFilter) => void setCategory(next),
    onTagsChange: (next: string[]) => void setTag(toggledTag({ current: tag, next })),
    onReset: () => {
      void setCategory(BLOG_PAGE.allCategories);
      void setTag(null);
    }
  };
};
