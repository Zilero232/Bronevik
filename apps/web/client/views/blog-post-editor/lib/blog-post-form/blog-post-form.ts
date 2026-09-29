import { isIncludedIn, unique } from 'remeda';

import type { CreateBlogPost } from '@/entities/blog/post';

import type { BlogPostFormValues, ToBlogPostFormValuesInput, ToBlogPostInput } from './blog-post-form.types';

import { BLOG_POST_FORM, BLOG_POST_FORM_DEFAULT_VALUES } from '../../config';

export const splitTags = (text: string): string[] =>
  unique(
    text
      .split(BLOG_POST_FORM.tagSeparator)
      .map((tag) => tag.trim().toLowerCase().replace(/^#/u, ''))
      .filter(Boolean)
  );

export const toBlogPostFormValues = ({ post, locale }: ToBlogPostFormValuesInput): BlogPostFormValues =>
  post
    ? {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        category: post.category,
        locale: post.locale,
        tags: post.tags.join(`${BLOG_POST_FORM.tagSeparator} `),
        coverKey: post.coverKey,
        coverUrl: post.coverUrl ?? '',
        seoTitle: post.seoTitle ?? '',
        seoDescription: post.seoDescription ?? '',
        isFeatured: post.isFeatured
      }
    : { ...BLOG_POST_FORM_DEFAULT_VALUES, locale: isIncludedIn(locale, BLOG_POST_FORM.locales) ? locale : BLOG_POST_FORM_DEFAULT_VALUES.locale };

export const toBlogPostInput = ({ values, status }: ToBlogPostInput): CreateBlogPost => ({
  title: values.title,
  ...(values.slug === '' ? {} : { slug: values.slug }),
  excerpt: values.excerpt,
  body: values.body,
  category: values.category,
  locale: values.locale,
  tags: values.tags,
  coverKey: values.coverKey,
  coverUrl: values.coverKey === null && values.coverUrl !== '' ? values.coverUrl : null,
  seoTitle: values.seoTitle === '' ? null : values.seoTitle,
  seoDescription: values.seoDescription === '' ? null : values.seoDescription,
  isFeatured: values.isFeatured,
  status
});
