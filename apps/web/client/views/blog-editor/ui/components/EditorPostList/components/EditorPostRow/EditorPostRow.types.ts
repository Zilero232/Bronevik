import type { BlogEditorPost } from '@/entities/blog/post';

export type EditorPostRowProps = {
  post: BlogEditorPost;
  isRemoving: boolean;
  onRemove: (id: string) => void;
};
