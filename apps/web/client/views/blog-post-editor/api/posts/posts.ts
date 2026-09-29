import type { BlogEditorPost, BlogImageUpload, CreateBlogPost } from '@/entities/blog/post';

import { blogEditorControllerCreate, blogEditorControllerGet, blogEditorControllerUpdate } from '@/shared/api/generated';
import { zBlogImageUpload } from '@/shared/api/generated/zod.gen';
import { api, SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk, fromServer } from '@/shared/api/source';

import type { GetEditorPostInput, UpdateBlogPostInput } from './posts.types';

import { BLOG_POST_FORM } from '../../config';

export const getEditorPost = ({ id, signal }: GetEditorPostInput): Promise<BlogEditorPost> =>
  fromSdk(() => blogEditorControllerGet({ ...SESSION_REQUEST, path: { id }, signal }));

export const createBlogPost = (body: CreateBlogPost): Promise<BlogEditorPost> =>
  fromSdk(() => blogEditorControllerCreate({ ...SESSION_REQUEST, body }));

export const updateBlogPost = ({ id, body }: UpdateBlogPostInput): Promise<BlogEditorPost> =>
  fromSdk(() => blogEditorControllerUpdate({ ...SESSION_REQUEST, path: { id }, body }));

export const uploadBlogImage = (file: File): Promise<BlogImageUpload> =>
  fromServer(async () => {
    const form = new FormData();

    form.append(BLOG_POST_FORM.upload.field, file);

    const { data } = await api.post<unknown>(BLOG_POST_FORM.upload.path, form, { ...SESSION_REQUEST, timeout: BLOG_POST_FORM.upload.timeoutMs });

    return zBlogImageUpload.parse(data);
  });
