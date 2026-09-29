import type { BlogEditorPostList } from '@/entities/blog/post';

import { blogEditorControllerList, blogEditorControllerRemove } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const listEditorPosts = (signal?: AbortSignal): Promise<BlogEditorPostList> =>
  fromSdk(() => blogEditorControllerList({ ...SESSION_REQUEST, signal }));

export const removeBlogPost = async (id: string): Promise<void> => {
  await fromSdk(() => blogEditorControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};
