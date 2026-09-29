import { describe, expect, it } from 'vitest';

import type { BlogEditorPost } from '@/entities/blog/post';

import { BLOG_POST_FORM_DEFAULT_VALUES } from '../../../config';
import { splitTags, toBlogPostFormValues, toBlogPostInput } from '../blog-post-form';
import { blogPostFormSchema } from '../blog-post-form.schemas';

const VALID = {
  ...BLOG_POST_FORM_DEFAULT_VALUES,
  title: 'Разбор патча 1.45',
  excerpt: 'Что поменялось в балансе и почему это важно для отметок',
  body: 'Большой текст статьи. '.repeat(10),
  tags: 'Баланс, #patch, баланс'
};

const POST: BlogEditorPost = {
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'patch-1-45',
  locale: 'en',
  title: VALID.title,
  excerpt: VALID.excerpt,
  cover: null,
  category: 'patches',
  tags: ['meta', 'patch'],
  author: null,
  readingMinutes: 2,
  isFeatured: true,
  publishedAt: null,
  updatedAt: '2026-09-21T10:00:00.000Z',
  body: VALID.body,
  toc: [],
  seoTitle: null,
  seoDescription: 'SEO',
  status: 'draft',
  createdAt: '2026-09-21T10:00:00.000Z',
  coverKey: null,
  coverUrl: 'https://example.com/cover.png'
};

describe('splitTags', () => {
  it('trims, lowercases, drops the hash and removes duplicates', () => {
    expect(splitTags(' Баланс, #patch ,, баланс ')).toEqual(['баланс', 'patch']);
  });

  it('returns no tags for an empty field', () => {
    expect(splitTags('')).toEqual([]);
  });
});

describe('blogPostFormSchema', () => {
  it('accepts an empty slug, cover URL and SEO fields', () => {
    expect(blogPostFormSchema.safeParse(VALID).success).toBe(true);
  });

  it('rejects a slug with capitals or spaces', () => {
    expect(blogPostFormSchema.safeParse({ ...VALID, slug: 'Patch 145' }).success).toBe(false);
  });

  it('rejects a cover URL that is not https', () => {
    expect(blogPostFormSchema.safeParse({ ...VALID, coverUrl: 'javascript:alert(1)' }).success).toBe(false);
  });
});

describe('toBlogPostInput', () => {
  it('sends null for empty optional fields and leaves the slug to the server', () => {
    const input = toBlogPostInput({ values: blogPostFormSchema.parse(VALID), status: 'draft' });

    expect(input).toMatchObject({ coverUrl: null, seoTitle: null, seoDescription: null, tags: ['баланс', 'patch'], status: 'draft' });
    expect(input).not.toHaveProperty('slug');
  });

  it('drops the cover URL while an uploaded cover is set', () => {
    const values = blogPostFormSchema.parse({
      ...VALID,
      coverKey: 'images/0b4c8f1e-2a6d-4c1b-9f5e-3d7a8b9c0d1e.png',
      coverUrl: 'https://example.com/a.png'
    });

    expect(toBlogPostInput({ values, status: 'published' }).coverUrl).toBeNull();
  });
});

describe('toBlogPostFormValues', () => {
  it('fills the form from a stored post and round-trips its tags', () => {
    const values = toBlogPostFormValues({ post: POST, locale: 'ru' });

    expect(blogPostFormSchema.parse(values).tags).toEqual(POST.tags);
    expect(values).toMatchObject({ locale: 'en', coverUrl: POST.coverUrl, seoTitle: '', isFeatured: true });
  });

  it('starts a new post in the page locale when it is supported', () => {
    expect(toBlogPostFormValues({ post: null, locale: 'en' }).locale).toBe('en');
    expect(toBlogPostFormValues({ post: null, locale: 'de' }).locale).toBe(BLOG_POST_FORM_DEFAULT_VALUES.locale);
  });
});
