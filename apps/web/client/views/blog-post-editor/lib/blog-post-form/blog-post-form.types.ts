import type { z } from 'zod';

import type { BlogEditorPost, CreateBlogPost } from '@/entities/blog/post';

import type { blogPostFormSchema } from './blog-post-form.schemas';

export type BlogPostFormValues = z.input<typeof blogPostFormSchema>;

export type BlogPostFormOutput = z.output<typeof blogPostFormSchema>;

export type BlogPostStatus = NonNullable<CreateBlogPost['status']>;

export type ToBlogPostInput = {
  values: BlogPostFormOutput;
  status: BlogPostStatus;
};

export type ToBlogPostFormValuesInput = {
  post: BlogEditorPost | null;
  locale: string;
};
