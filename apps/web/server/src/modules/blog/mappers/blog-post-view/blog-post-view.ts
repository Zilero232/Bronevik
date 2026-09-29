import { isIncludedIn } from 'remeda';

import type { BlogEditorPostView, BlogPostSummaryView, BlogPostView } from '../../blog.types';
import type { BlogCoverInput, ImageFileUrlInput, ToBlogPostViewInput } from './blog-post-view.types';

import { toIso } from '../../../../common/lib';
import { toAuthorView } from '../../../community-core';
import { BLOG, BLOG_IMAGES } from '../../config';
import { outlineArticle } from '../../lib';

export const imageFileUrl = ({ key, apiUrl }: ImageFileUrlInput): string =>
  new URL(BLOG_IMAGES.route.replace('{file}', key.slice(BLOG_IMAGES.prefix.length + 1)), apiUrl).href;

export const blogCoverUrl = ({ post, apiUrl }: BlogCoverInput): string | null =>
  post.coverKey ? imageFileUrl({ key: post.coverKey, apiUrl }) : post.coverUrl;

export const toBlogPostSummary = ({ post, apiUrl }: ToBlogPostViewInput): BlogPostSummaryView => ({
  id: post.id,
  slug: post.slug,
  locale: isIncludedIn(post.locale, BLOG.locales) ? post.locale : 'ru',
  title: post.title,
  excerpt: post.excerpt,
  cover: blogCoverUrl({ post, apiUrl }),
  category: post.category,
  tags: post.tags,
  author: post.author ? toAuthorView(post.author) : null,
  readingMinutes: post.readingMinutes,
  isFeatured: post.isFeatured,
  publishedAt: toIso(post.publishedAt),
  updatedAt: post.updatedAt.toISOString()
});

export const toBlogPostView = ({ post, apiUrl }: ToBlogPostViewInput): BlogPostView => ({
  ...toBlogPostSummary({ post, apiUrl }),
  body: post.body,
  toc: outlineArticle(post.body).toc,
  seoTitle: post.seoTitle,
  seoDescription: post.seoDescription,
  status: post.status,
  createdAt: post.createdAt.toISOString()
});

export const toBlogEditorPostView = ({ post, apiUrl }: ToBlogPostViewInput): BlogEditorPostView => ({
  ...toBlogPostView({ post, apiUrl }),
  coverKey: post.coverKey,
  coverUrl: post.coverUrl
});
