import { blogControllerArticle, blogControllerList, blogControllerTags, blogEditorControllerAccess } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { BlogArticle, BlogArticleInput, BlogEditorAccess, BlogListInput, BlogPostPage, BlogTags } from './posts.types';

export const listBlogPosts = ({ signal, ...query }: BlogListInput): Promise<BlogPostPage> => fromSdk(() => blogControllerList({ query, signal }));

export const getBlogArticle = ({ slug, signal }: BlogArticleInput): Promise<BlogArticle> =>
  fromSdk(() => blogControllerArticle({ path: { slug }, signal }));

export const getBlogTags = (signal?: AbortSignal): Promise<BlogTags> => fromSdk(() => blogControllerTags({ signal }));

export const getBlogEditorAccess = (signal?: AbortSignal): Promise<BlogEditorAccess> =>
  fromSdk(() => blogEditorControllerAccess({ ...SESSION_REQUEST, signal }));
