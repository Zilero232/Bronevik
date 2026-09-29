import type { BlogEditorPost, UpdateBlogPost } from '@/entities/blog/post';

export type UpdateBlogPostInput = {
  id: string;
  body: UpdateBlogPost;
};

export type SavedBlogPost = BlogEditorPost;
