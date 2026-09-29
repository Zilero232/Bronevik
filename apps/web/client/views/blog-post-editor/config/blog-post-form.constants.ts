import { zCreateBlogPost } from '@/entities/blog/post';

import type { BlogPostFormValues } from '../lib/blog-post-form';

export const BLOG_POST_FORM = {
  titleMin: zCreateBlogPost.shape.title.minLength ?? 0,
  titleMax: zCreateBlogPost.shape.title.maxLength ?? undefined,
  excerptMin: zCreateBlogPost.shape.excerpt.minLength ?? 0,
  excerptMax: zCreateBlogPost.shape.excerpt.maxLength ?? undefined,
  tagSeparator: ',',
  locales: ['ru', 'en'],
  skeletonHeights: [56, 480],
  upload: {
    path: '/blog/editor/images',
    field: 'file',
    accept: 'image/png,image/jpeg,image/webp,image/avif',
    timeoutMs: 60_000
  }
} as const;

export const BLOG_POST_FORM_DEFAULT_VALUES: BlogPostFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: 'announcements',
  locale: 'ru',
  tags: '',
  coverKey: null,
  coverUrl: '',
  seoTitle: '',
  seoDescription: '',
  isFeatured: false
};
