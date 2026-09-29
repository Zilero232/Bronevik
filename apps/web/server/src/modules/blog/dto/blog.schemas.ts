import { booleanParam, countSchema, httpsUrlSchema, isoDateTimeSchema, paginatedSchema, paginationQuerySchema, uuidSchema } from '@otmetki/schemas';
import { z } from 'zod';

import { authorSchema } from '../../community-core';
import { BLOG, BLOG_IMAGES, BLOG_POST_LIMITS } from '../config';

export const blogCategorySchema = z.enum(BLOG.categories);

export const blogStatusSchema = z.enum(['draft', 'published']);

export const blogLocaleSchema = z.enum(BLOG.locales);

const blogTagSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(BLOG_POST_LIMITS.tag.min)
  .max(BLOG_POST_LIMITS.tag.max)
  .regex(/^[\p{L}\p{N}][\p{L}\p{N}-]*$/u);

const blogSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(BLOG.slugMaxLength)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const coverExtensions = Object.keys(BLOG_IMAGES.types).join('|');

export const blogImageFileSchema = z.string().regex(new RegExp(`^[0-9a-f-]{36}\\.(?:${coverExtensions})$`));

export const blogImageKeySchema = z.string().regex(new RegExp(`^${BLOG_IMAGES.prefix}/[0-9a-f-]{36}\\.(?:${coverExtensions})$`));

export const blogTocItemSchema = z.object({ id: z.string(), text: z.string(), depth: z.number().int().min(1).max(6) });

export const blogPostSummarySchema = z.object({
  id: uuidSchema,
  slug: z.string(),
  locale: blogLocaleSchema,
  title: z.string(),
  excerpt: z.string(),
  cover: z.url().nullable(),
  category: blogCategorySchema,
  tags: z.array(z.string()),
  author: authorSchema.nullable(),
  readingMinutes: z.number().int().positive(),
  isFeatured: z.boolean(),
  publishedAt: isoDateTimeSchema.nullable(),
  updatedAt: isoDateTimeSchema
});

export const blogPostSchema = blogPostSummarySchema.extend({
  body: z.string(),
  toc: z.array(blogTocItemSchema),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  status: blogStatusSchema,
  createdAt: isoDateTimeSchema
});

export const blogArticleSchema = z.object({ post: blogPostSchema, related: z.array(blogPostSummarySchema) });

export const blogEditorPostSchema = blogPostSchema.extend({ coverKey: z.string().nullable(), coverUrl: z.string().nullable() });

export const blogEditorPostListSchema = z.array(blogEditorPostSchema);

export const blogPostPageSchema = paginatedSchema(blogPostSummarySchema);

export const blogPostsQuerySchema = paginationQuerySchema.extend({
  category: blogCategorySchema.optional(),
  tag: blogTagSchema.optional(),
  locale: blogLocaleSchema.optional(),
  isFeatured: booleanParam.optional()
});

export const blogTagCountSchema = z.object({ tag: z.string(), count: countSchema });

export const blogTagsSchema = z.array(blogTagCountSchema);

export const blogSlugParamsSchema = z.object({ slug: z.string().trim().min(1).max(BLOG.slugMaxLength) });

export const blogImageParamsSchema = z.object({ file: blogImageFileSchema });

export const blogEditorAccessSchema = z.object({ canEdit: z.boolean() });

export const blogImageUploadSchema = z.object({ key: blogImageKeySchema, url: z.url() });

const blogPostFieldsSchema = z.object({
  slug: blogSlugSchema.optional(),
  locale: blogLocaleSchema,
  title: z.string().trim().min(BLOG_POST_LIMITS.title.min).max(BLOG_POST_LIMITS.title.max),
  excerpt: z.string().trim().min(BLOG_POST_LIMITS.excerpt.min).max(BLOG_POST_LIMITS.excerpt.max),
  body: z.string().trim().min(BLOG_POST_LIMITS.body.min).max(BLOG_POST_LIMITS.body.max),
  category: blogCategorySchema,
  tags: z
    .array(blogTagSchema)
    .max(BLOG_POST_LIMITS.tags)
    .transform((tags) => [...new Set(tags)]),
  coverKey: blogImageKeySchema.nullable(),
  coverUrl: httpsUrlSchema.nullable(),
  seoTitle: z.string().trim().max(BLOG_POST_LIMITS.seoTitle).nullable(),
  seoDescription: z.string().trim().max(BLOG_POST_LIMITS.seoDescription).nullable(),
  isFeatured: z.boolean(),
  status: blogStatusSchema
});

export const createBlogPostSchema = blogPostFieldsSchema.extend({
  locale: blogLocaleSchema.default('ru'),
  tags: blogPostFieldsSchema.shape.tags.default([]),
  coverKey: blogPostFieldsSchema.shape.coverKey.default(null),
  coverUrl: blogPostFieldsSchema.shape.coverUrl.default(null),
  seoTitle: blogPostFieldsSchema.shape.seoTitle.default(null),
  seoDescription: blogPostFieldsSchema.shape.seoDescription.default(null),
  isFeatured: z.boolean().default(false),
  status: blogStatusSchema.default('draft')
});

export const updateBlogPostSchema = blogPostFieldsSchema.partial();
