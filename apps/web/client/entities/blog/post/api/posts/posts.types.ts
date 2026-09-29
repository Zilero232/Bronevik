import type { BlogArticle, BlogControllerListData, BlogPostPage } from '@/shared/api/generated';

export type {
  BlogArticle,
  BlogEditorAccess,
  BlogEditorPost,
  BlogEditorPostList,
  BlogImageUpload,
  BlogPostPage,
  BlogTags,
  CreateBlogPost,
  UpdateBlogPost
} from '@/shared/api/generated';

export type BlogPostSummary = BlogPostPage['items'][number];

export type BlogPost = BlogArticle['post'];

export type BlogCategory = BlogPost['category'];

export type BlogLocale = BlogPost['locale'];

export type BlogTocItem = BlogPost['toc'][number];

export type BlogListQuery = NonNullable<BlogControllerListData['query']>;

export type BlogListInput = BlogListQuery & {
  signal?: AbortSignal;
};

export type BlogArticleInput = {
  slug: string;
  signal?: AbortSignal;
};
