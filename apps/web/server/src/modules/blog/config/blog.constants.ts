import { BLOG_CONTRACT } from '@otmetki/schemas';

export const BLOG = {
  editorRoles: ['admin', 'moderator'],
  locales: BLOG_CONTRACT.locales,
  defaultLocale: 'ru',
  relatedLimit: 3,
  tagsLimit: 30,
  editorLimit: 200,
  wordsPerMinute: 200,
  tocDepths: [2, 3],
  slugMinLength: 3,
  slugMaxLength: 96,
  slugFallback: 'post',
  reservedSlugs: ['editor', 'rss']
} as const;

export const BLOG_POST_LIMITS = {
  title: { min: 5, max: 140 },
  excerpt: { min: 20, max: 300 },
  body: { min: 50, max: 100_000 },
  tag: { min: 2, max: 32 },
  tags: 8,
  seoTitle: 70,
  seoDescription: 170
} as const;
