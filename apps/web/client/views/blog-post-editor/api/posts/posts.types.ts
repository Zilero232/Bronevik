import type { UpdateBlogPost } from '@/entities/blog/post';

export type UpdateBlogPostInput = {
  id: string;
  body: UpdateBlogPost;
};

export type GetEditorPostInput = {
  id: string;
  signal?: AbortSignal;
};
