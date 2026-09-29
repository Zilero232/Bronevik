import type { z } from 'zod';

import type { ById, Owned } from '../community-core';
import type { blogPostsQuerySchema, createBlogPostSchema, updateBlogPostSchema } from './dto/blog.schemas';

export type BlogPostsQuery = z.output<typeof blogPostsQuerySchema>;
export type CreateBlogPostRequest = z.output<typeof createBlogPostSchema> & Owned;
export type UpdateBlogPostRequest = z.output<typeof updateBlogPostSchema> & ById;

export type SlugWriteInput<T> = {
  slug: string;
  write: () => Promise<T>;
};

export type UploadedBlogImage = {
  buffer: Buffer;
  size: number;
};

export type BlogImageFile = {
  bytes: Uint8Array;
  contentType: string;
};
