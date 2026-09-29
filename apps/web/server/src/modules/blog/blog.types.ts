import type { z } from 'zod';

import type { ById, Owned } from '../community-core';
import type {
  blogArticleSchema,
  blogEditorAccessSchema,
  blogEditorPostSchema,
  blogImageUploadSchema,
  blogPostPageSchema,
  blogPostSchema,
  blogPostsQuerySchema,
  blogPostSummarySchema,
  blogTagCountSchema,
  blogTocItemSchema,
  createBlogPostSchema,
  updateBlogPostSchema
} from './dto/blog.schemas';

export type BlogPostSummaryView = z.infer<typeof blogPostSummarySchema>;
export type BlogPostView = z.infer<typeof blogPostSchema>;
export type BlogArticleView = z.infer<typeof blogArticleSchema>;
export type BlogEditorPostView = z.infer<typeof blogEditorPostSchema>;
export type BlogPostPage = z.infer<typeof blogPostPageSchema>;
export type BlogPostsQuery = z.output<typeof blogPostsQuerySchema>;
export type BlogTagCount = z.infer<typeof blogTagCountSchema>;
export type BlogTocItem = z.infer<typeof blogTocItemSchema>;
export type BlogEditorAccess = z.infer<typeof blogEditorAccessSchema>;
export type BlogImageUpload = z.infer<typeof blogImageUploadSchema>;
export type CreateBlogPostRequest = z.output<typeof createBlogPostSchema> & Owned;
export type UpdateBlogPostRequest = z.output<typeof updateBlogPostSchema> & ById;

export type UploadedBlogImage = {
  buffer: Buffer;
  size: number;
};

export type BlogImageFile = {
  bytes: Uint8Array;
  contentType: string;
};
