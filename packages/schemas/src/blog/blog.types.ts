import type { z } from 'zod';

import type {
  blogArticleSchema,
  blogEditorAccessSchema,
  blogEditorPostSchema,
  blogImageUploadSchema,
  blogPostPageSchema,
  blogPostSchema,
  blogPostSummarySchema,
  blogTagCountSchema,
  blogTocItemSchema
} from './blog.schemas';

export type BlogPostSummary = z.infer<typeof blogPostSummarySchema>;
export type BlogPostView = z.infer<typeof blogPostSchema>;
export type BlogArticle = z.infer<typeof blogArticleSchema>;
export type BlogEditorPost = z.infer<typeof blogEditorPostSchema>;
export type BlogPostPage = z.infer<typeof blogPostPageSchema>;
export type BlogTagCount = z.infer<typeof blogTagCountSchema>;
export type BlogTocItem = z.infer<typeof blogTocItemSchema>;
export type BlogEditorAccess = z.infer<typeof blogEditorAccessSchema>;
export type BlogImageUpload = z.infer<typeof blogImageUploadSchema>;
